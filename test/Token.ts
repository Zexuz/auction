import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Lock", function () {
  async function fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const contract = await Token.deploy(owner);

    return {contract, owner, otherAccount};
  }

  describe("Deployment", function () {
  });

  describe("Withdrawals", function () {

    describe("AuctionId 1", function () {
      const auctionId = 1;
      const cases = [
        {bid: 100, allBids: 100, expected: 100000},
        {bid: 100, allBids: 200, expected: 50000},
        {bid: 100, allBids: 300, expected: 33333},
        {bid: 100, allBids: 400, expected: 25000},
      ];

      cases.forEach(({bid, allBids, expected}) => {
        it(`should calculate the correct token distribution for ${bid} bid with ${allBids} total bids`, async () => {
          const {contract} = await loadFixture(fixture);

          expect(await contract.calculateTokenDistribution(auctionId, bid, allBids)).to.equal(expected);
        });
      });
    });

    describe("AuctionId 100000000", function () {
      const auctionId = 2;
      const cases = [
        {bid: 100, allBids: 100, expected: 100000},
        {bid: 100, allBids: 200, expected: 50000},
        {bid: 100, allBids: 300, expected: 33333},
        {bid: 100, allBids: 400, expected: 25000},
      ];

      cases.forEach(({bid, allBids, expected}) => {
        it(`should calculate the correct token distribution for ${bid} bid with ${allBids} total bids`, async () => {
          const {contract} = await loadFixture(fixture);

          expect(await contract.calculateTokenDistribution(auctionId, bid, allBids)).to.equal(expected);
        });
      });
    });

  });
});
