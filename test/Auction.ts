import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Auction", function () {

  /*

  Contract functions:
  ResumeAuction(uint _auctionId) onlySelf
  PauseAuction(uint _auctionId) onlySelf

  StartAuction(uint _auctionId, uint _durationInSecs) onlySelf
  Bid(uint _auctionId) payable
  EndAuction(uint _auctionId) onlySelf
  */


  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("Auction");
    const auction = await Auction.deploy();

    return {auction, owner, otherAccount};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      expect(await auction.owner()).to.equal(owner.address);
    });

    it("Should set the right auctionId", async function () {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      expect(await auction.getAuctionId()).to.equal(0);
    });
  });

  describe("Auction", function () {
    it("Should set the correct auctionId", async function () {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");
      const durationInSecs = 60 * 60;

      await auction.startAuction({value: amount});

      expect(await auction.getAuctionId()).to.equal(1);
    });

    it('should set the correct start time', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");
      const durationInSecs = 60 * 60;

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      //Add 1 second b/c of the block time (Its the next block)
      expect(current.startTime).to.approximately((Math.floor(Date.now() / 1000)) + 1, 1);
    });

    it("Should set the correct end time", async function () {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");
      const durationInSecs = 60 * 60;

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.endTime).to.approximately(Math.floor(Date.now() / 1000) + durationInSecs, 1);
    });


    it('should set the correct amount', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");
      const durationInSecs = 60 * 60;

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.amount).to.equal(amount);
    });

    it('should set the correct durationIncrease', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");
      const durationInSecs = 60 * 60;
      const durationIncreaseInSecondsPerBid = 60 * 5;

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.durationIncreaseInSecondsPerBid).to.equal(durationIncreaseInSecondsPerBid);
    });


    it('should set the correct highest bid', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.highestBid).to.equal(0);
    });

    it('should set the correct highest bidder', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.highestBidder).to.equal("0x0000000000000000000000000000000000000000");
    });

    it('should set the correct ended status', async () => {
      const {auction, owner} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseEther("1.0");

      await auction.startAuction({value: amount});

      const current = await auction.getAuction(1);

      expect(current.ended).to.equal(false);
    });

  });
});
