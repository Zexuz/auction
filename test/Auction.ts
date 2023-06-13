import {loadFixture, time} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ContractTransactionResponse} from "ethers";
import {ethers} from "hardhat";
import {Auction} from "../typechain-types";

describe("Auction", function () {

  async function fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const amount = ethers.parseEther("1.0");

    const Auction = await ethers.getContractFactory("Auction");
    const auction = await Auction.deploy({value: amount});
    const auctionId = 1;

    return {auction, owner, otherAccount, auctionId};
  }

  async function getCurrentAuction(auction: Auction & { deploymentTransaction(): ContractTransactionResponse }) {
    return await auction.getAuction(1);
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const {auction, owner} = await loadFixture(fixture);

      expect(await auction.owner()).to.equal(owner.address);
    });

    it("Should set the right auctionId", async function () {
      const {auction, owner} = await loadFixture(fixture);

      expect(await auction.getAuctionId()).to.equal(1);
    });
  });

  describe("Auction", function () {
    it("Should set the correct auctionId", async function () {
      const {auction, owner} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);

      expect(current.id).to.equal(1);
    });

    it('should set the correct start time', async () => {
      const {auction, owner} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);
      const latestTime = await time.latest();

      expect(current.startTime).to.approximately(latestTime, 1);
    });

    it("Should set the correct end time", async function () {
      const {auction, owner} = await loadFixture(fixture);
      const durationInSecs = 60 * 60;

      const current = await getCurrentAuction(auction);

      expect(current.endTime).to.approximately(Math.floor(Date.now() / 1000) + durationInSecs, 1);
    });


    it('should set the correct amount', async () => {
      const {auction, owner} = await loadFixture(fixture);
      const amount = ethers.parseEther("1.0");

      const current = await getCurrentAuction(auction);

      expect(current.amount).to.equal(amount);
    });

    it('should set the correct durationIncrease', async () => {
      const {auction, owner} = await loadFixture(fixture);
      const durationIncreaseInSecondsPerBid = 60 * 5;

      const current = await getCurrentAuction(auction);

      expect(current.durationIncreaseInSecondsPerBid).to.equal(durationIncreaseInSecondsPerBid);
    });


    it('should set the correct highest bid', async () => {
      const {auction, owner} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);

      expect(current.highestBid).to.equal(0);
    });

    it('should set the correct highest bidder', async () => {
      const {auction, owner} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);

      expect(current.highestBidder).to.equal("0x0000000000000000000000000000000000000000");
    });

    it('should set the correct ended status', async () => {
      const {auction, owner} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);

      expect(current.ended).to.equal(false);
    });
  });

  describe("Bid", function () {
    it('should throw if the auction has ended', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");

      const current = await getCurrentAuction(auction);
      await time.increaseTo(current.endTime + BigInt(1));

      await expect(auction.bid(auctionId, {value: amount})).to.be.revertedWith("Auction already ended.");
    });

    it('should throw if the auction does not exists', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const nextAuctionId = auctionId + 1;

      await expect(auction.bid(nextAuctionId)).to.be.revertedWith("Auction does not exist.");
    });

    it('should set the highest bid', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");

      await auction.bid(auctionId, {value: amount});
      const current = await auction.getAuction(auctionId);

      expect(current.highestBid).to.equal(amount);
    });

    it('should set the highest bidder', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");

      await auction.bid(auctionId, {value: amount});
      const current = await auction.getAuction(auctionId);

      expect(current.highestBidder).to.equal(owner.address);
    });

    it('should not change the end time when there is more time left then durationIncreaseTimeLeft', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");
      const auctionDurationInSeconds = BigInt(60 * 60);

      await auction.bid(auctionId, {value: amount});
      const current = await auction.getAuction(auctionId);

      expect(current.endTime).to.approximately(current.startTime + auctionDurationInSeconds, 1);
    });

    it('should set the correct end time when there is less then durationIncreaseTimeLeft', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");
      const auctionDurationInSeconds = BigInt(60 * 60);
      const durationIncreaseInSecondsPerBid = BigInt(60 * 5);

      const current = await getCurrentAuction(auction);
      await time.increaseTo(current.endTime - BigInt(1));

      await auction.bid(auctionId, {value: amount});
      const updated = await auction.getAuction(auctionId);


      expect(updated.endTime).to.approximately(updated.startTime + auctionDurationInSeconds + durationIncreaseInSecondsPerBid, 1);
    });

    const tests = [
      ethers.parseEther("0.1"),
      ethers.parseEther("0.5"),
      ethers.parseEther("1.0"),
    ];

    tests.forEach(async (ethAmount) => {
      it(`should throw if the bid is lower than the current highest bid: ${ethAmount}`, async () => {
        const {auction, owner, otherAccount, auctionId} = await loadFixture(fixture);

        await auction.bid(auctionId, {value: ethers.parseEther("1.0")});

        await expect(auction.connect(otherAccount).bid(auctionId, {value: ethAmount})).to.be.revertedWith("There already is a higher bid.");
      });
    });

    it('should add bid to the table', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);
      const amount = ethers.parseEther("0.955");

      await auction.bid(auctionId, {value: amount});
      const bids = await auction.getBidsKeyForAuction(auctionId);

      expect(bids.length).to.equal(1);
    });

    it('should throw if the bid is 0', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await expect(auction.bid(auctionId, {value: 0})).to.be.revertedWith("Bid amount must be greater than 0.");
    });

    it('should throw if the highest bid is the same as the current bid', async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await auction.bid(auctionId, {value: ethers.parseEther("0.955")});
      await expect(auction.bid(auctionId, {value: ethers.parseEther("1.955")})).to.be.revertedWith("You already have the highest bid.");
    });

    it('should update the bid if the user already has a bid', async () => {
      const {auction, owner, otherAccount, auctionId} = await loadFixture(fixture);

      await auction.bid(auctionId, {value: ethers.parseEther("1.0")});

      //change the sender address
      await auction.connect(otherAccount).bid(auctionId, {value: ethers.parseEther("1.1")});

      await auction.connect(owner).bid(auctionId, {value: ethers.parseEther("0.2")});
      const bids = await auction.getBidsKeyForAuction(auctionId);

      expect(bids.length).to.equal(2);
    });

    it('should throw if bid is not increased by the minimum bid increase', async () => {
      const {auction, owner, otherAccount, auctionId} = await loadFixture(fixture);

      await auction.bid(auctionId, {value: ethers.parseEther("1.0")});

      await expect(auction.connect(otherAccount).bid(auctionId, {value: ethers.parseEther("1.019")})).to.be.revertedWith("Bid amount must be greater than the minimum bid increment percent.");
    });
  });

  describe("Settle", function () {

    it("should throw if the auction has not ended", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await expect(auction.settle(auctionId)).to.be.revertedWith("Auction has not ended yet.");
    });

    it("should set ended to true", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await time.increaseTo((await auction.getAuction(auctionId)).endTime + BigInt(1));
      await auction.settle(auctionId);
      const current = await auction.getAuction(auctionId);

      expect(current.ended).to.equal(true);
    });

    it("should throw if auction does not exist", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await expect(auction.settle(auctionId + 1)).to.be.revertedWith("Auction does not exist.");
    });

    it("should throw if auction has already ended", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      await time.increaseTo((await auction.getAuction(auctionId)).endTime + BigInt(1));
      await auction.settle(auctionId);

      await expect(auction.settle(auctionId)).to.be.revertedWith("Auction already ended.");
    });

    it("should transfer the value to the highest bidder", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);
      await auction.bid(auctionId, {value: ethers.parseEther("0.955")});
      await time.increaseTo((await auction.getAuction(auctionId)).endTime + BigInt(1));
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const settleResponse = await auction.settle(auctionId);
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      const wait = await settleResponse.wait();
      if (!wait)
        throw new Error("Wait is null");
      const gasUsed = wait.gasUsed * ethers.parseUnits("1", 'gwei');

      const diff = balanceAfter - balanceBefore + gasUsed;
      expect(diff).to.approximately(current.amount, current.amount / 100n);
    });

    it("should start a new auction with auction id + 1", async () => {
      const {auction, owner, auctionId} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);
      await auction.bid(auctionId, {value: ethers.parseEther("0.955")});
      await time.increaseTo((await auction.getAuction(auctionId)).endTime + BigInt(1));
      await auction.settle(auctionId);
      const newAuction = await auction.getAuction(auctionId + 1);

      expect(newAuction.id).to.equal(current.id + BigInt(1));
    });

    it("should transfer 40% to the LP", async () => {
      // TODO
      expect(true).to.equal(false);
    });

    it('should start a new auction with 60% of the value', async () => {
      const {auction, owner, otherAccount, auctionId} = await loadFixture(fixture);

      const current = await getCurrentAuction(auction);
      await auction.bid(auctionId, {value: ethers.parseEther("1")});
      await auction.connect(otherAccount).bid(auctionId, {value: ethers.parseEther("3")});
      await time.increaseTo((await auction.getAuction(auctionId)).endTime + BigInt(1));
      await auction.settle(auctionId);
      const newAuction = await auction.getAuction(auctionId + 1);

      expect(newAuction.amount).to.equal(ethers.parseEther("2.4"));
    });


  });
});
