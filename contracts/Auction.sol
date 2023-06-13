// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Auction {
    uint private constant FIVE_MINUTES_IN_SECONDS = 60 * 5;
    uint private constant ONE_HOUR_IN_SECONDS = 60 * 60;
    uint private constant MINIMUM_BID_INCREMENT_PERCENT = 2;

    address payable public owner;

    uint private _auctionId;

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
        address highestBidder;
        bool ended;
    }

    struct AuctionBids {
        mapping(address => Bid) bids;
        address[] keys;
    }

    mapping(uint => AuctionBids) internal auctionBids;
    mapping(uint => Auction) internal auctions;

    constructor() payable {
        owner = payable(msg.sender);
        _auctionId = 0;
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

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        if (auction.endTime - block.timestamp < auction.durationIncreaseInSecondsPerBid) {
            auction.endTime = auction.endTime + auction.durationIncreaseInSecondsPerBid;
        }
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
            address(0),
            false
        );
    }

    function startAuction() payable public {
        Auction memory auction = _createAuction(msg.value);
        _auctionId = auction.id;
        auctions[auction.id] = auction;
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

}