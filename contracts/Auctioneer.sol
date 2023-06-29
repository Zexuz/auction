// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Auctioneer {
    uint private constant FIVE_MINUTES_IN_SECONDS = 60 * 5;
    uint private constant ONE_HOUR_IN_SECONDS = 60 * 60;
    uint private constant MINIMUM_BID_INCREMENT_PERCENT = 2;

    address payable public owner;

    uint private _auctionId;

    event AuctionStared(uint id, uint amount, uint startTime, uint endTime, uint durationIncreaseInSecondsPerBid);
    event BidPlaced(uint auctionId, uint amount, uint timestamp, address bidder);

    struct Bid {
        uint amount;
        uint timestamp;
        address bidder;
    }

    struct Auction {
        uint id;
        uint amount;
        uint startTime;
        uint endTime;
        uint durationIncreaseInSecondsPerBid;
        uint highestBid;
        address payable highestBidder;
        bool ended;
    }

    struct AuctionBids {
        mapping(address => Bid) bids;
        address[] keys;
    }

    mapping(uint => AuctionBids) internal auctionBids;
    mapping(uint => Auction) internal auctions;
    mapping(uint => Bid[]) internal bidsForAuction;

    constructor() payable {
        owner = payable(msg.sender);
        _auctionId = 0;
        startAuction(msg.value);
    }

    function _getOrCreateBid(uint value, address bidder) internal returns (Bid memory) {
        Bid memory bid = auctionBids[_auctionId].bids[bidder];
        if (bid.bidder == address(0)) {
            return _createBid(value, bidder);
        }
        return _createBid(bid.amount + value, bidder);
    }

    function bid(uint auctionId) payable public {
        Auction storage auction = auctions[auctionId];
        require(auction.id != 0, "Auction does not exist.");
        require(msg.value > 0, "Bid amount must be greater than 0.");
        require(block.timestamp <= auction.endTime, "Auction already ended.");

        Bid memory bid = _getOrCreateBid(msg.value, msg.sender);

        require(bid.amount > auction.highestBid, "There already is a higher bid.");
        require(auction.highestBidder != msg.sender, "You already have the highest bid.");
        require(bid.amount >= auction.highestBid + (auction.highestBid * MINIMUM_BID_INCREMENT_PERCENT / 100), "Bid amount must be greater than the minimum bid increment percent.");

        if (auctionBids[auctionId].bids[msg.sender].bidder == address(0)) {
            auctionBids[auctionId].keys.push(msg.sender);
        }
        auctionBids[auctionId].bids[msg.sender] = bid;
        bidsForAuction[auctionId].push(bid);

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);
        if (auction.endTime - block.timestamp < auction.durationIncreaseInSecondsPerBid) {
            auction.endTime = auction.endTime + auction.durationIncreaseInSecondsPerBid;
        }
        emit BidPlaced(auctionId, bid.amount, bid.timestamp, bid.bidder);
    }

    function settle(uint auctionId) external {
        Auction storage auction = auctions[auctionId];
        require(auction.id != 0, "Auction does not exist.");
        require(!auction.ended, "Auction already ended.");
        require(block.timestamp > auction.endTime, "Auction has not ended yet.");

        auction.ended = true;
        auction.highestBidder.transfer(auction.amount);

        // get all bids for auction
        AuctionBids storage bids = auctionBids[auctionId];
        // loop through all bids
        uint totalValue = 0;
        for (uint i = 0; i < bids.keys.length; i++) {
            totalValue += bids.bids[bids.keys[i]].amount;
        }

        uint replenish = totalValue * 60 / 100;
        //        uint rest = totalValue - replenish;
        //        sendToLP(rest);
        startAuction(replenish);
    }

    function sendToLP(uint value) internal {
        // TODO, send to LP
    }


    function _createBid(uint amount, address bidder) internal returns (Bid memory){
        return Bid(
            amount,
            block.timestamp,
            bidder
        );
    }

    function _createAuction(uint amount) internal returns (Auction memory){
        return Auction(
            _auctionId + 1,
            amount,
            block.timestamp,
            block.timestamp + ONE_HOUR_IN_SECONDS,
            FIVE_MINUTES_IN_SECONDS,
            0,
            payable(address(0)),
            false
        );
    }

    function startAuction(uint value) internal {
        Auction memory auction = _createAuction(value);
        _auctionId = auction.id;
        auctions[auction.id] = auction;
        emit AuctionStared(auction.id, auction.amount, auction.startTime, auction.endTime, auction.durationIncreaseInSecondsPerBid);
    }

    function getAuction(uint auctionId) public view returns (Auction memory) {
        return auctions[auctionId];
    }

    function getBidsKeyForAuction(uint auctionId) public view returns (address[] memory) {
        return auctionBids[auctionId].keys;
    }

    function getBidForAuction(uint auctionId, address bidder) public view returns (Bid memory) {
        return auctionBids[auctionId].bids[bidder];
    }

    function getAuctionId() public view returns (uint) {
        return _auctionId;
    }

    function getBidsForAuction(uint auctionId) public view returns (Bid[] memory) {
        return bidsForAuction[auctionId];
    }
}