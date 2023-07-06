// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//TODO S:
// - If bet is placed at the last minute, the auction should reset to 5 minutes, not extend by 5 minutes
contract AuctioneerSimple {
    uint private constant FIVE_MINUTES_IN_SECONDS = 60 * 5;
    uint private constant ONE_HOUR_IN_SECONDS = 1 * 60;
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
        uint secondHighestBid;
        address secondHighestBidder;
        bool ended;
    }

    struct AuctionBids {
        mapping(address => Bid) bids;
        address[] keys;
    }

    mapping(uint => AuctionBids) internal auctionBids;
    mapping(uint => Auction) internal auctions;
    mapping(uint => Bid[]) internal bidsForAuction;
    mapping(uint => mapping(address => bool)) internal reclaimedBidsForAuction;

    constructor() payable {
        owner = payable(msg.sender);
        _auctionId = 0;
        startAuction(msg.value);
    }

    function _getOrCreateBid(uint value, address bidder) internal returns (Bid memory, bool hasExistingBid) {
        Bid memory bid = auctionBids[_auctionId].bids[bidder];
        if (bid.bidder == address(0)) {
            return (_createBid(value, bidder), false);
        }
        return (_createBid(bid.amount + value, bidder), true);
    }

    function bid(uint auctionId) payable public {
        Auction storage auction = auctions[auctionId];
        require(auction.id != 0, "Auction does not exist.");
        require(msg.value > 0, "Bid amount must be greater than 0.");
        require(block.timestamp <= auction.endTime, "Auction already ended.");
//        require(auction.highestBidder != msg.sender, "You already have the highest bid.");

        (Bid memory bid, bool hasExistingBid) = _getOrCreateBid(msg.value, msg.sender);

        if (hasExistingBid) {
            require(bid.amount >= auction.highestBid + (auction.highestBid * MINIMUM_BID_INCREMENT_PERCENT / 100), "Bid amount must be greater than the minimum bid increment percent.");
        } else {
            require(bid.amount > auction.highestBid, "There already is a higher bid.");
        }

        if (auctionBids[auctionId].bids[msg.sender].bidder == address(0)) {
            auctionBids[auctionId].keys.push(msg.sender);
        }
        auctionBids[auctionId].bids[msg.sender] = bid;
        bidsForAuction[auctionId].push(bid);

        auction.secondHighestBid = auction.highestBid;
        auction.secondHighestBidder = auction.highestBidder;

        auction.highestBid = bid.amount;
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

        uint halfOfSecondHighestBid = auction.secondHighestBid / 2;
        uint totalAmount = auction.amount + halfOfSecondHighestBid;
        auction.ended = true;
        auction.highestBidder.transfer(totalAmount);

        // get all bids for auction
        AuctionBids storage bids = auctionBids[auctionId];
        // loop through all bids
        uint totalValue = 0;
        for (uint i = 0; i < bids.keys.length; i++) {
            totalValue += bids.bids[bids.keys[i]].amount;
        }

        uint replenish = totalValue * 1 / 100;
        startAuction(replenish);
    }

    function reclaimForAuction(uint auctionId) external {
        Auction storage auction = auctions[auctionId];
        require(auction.id != 0, "Auction does not exist.");
        require(auction.ended, "Auction has not ended yet.");
        require(auction.highestBidder != msg.sender, "You won the auction, bid amount is not reclaimable.");
        require(auction.secondHighestBidder != msg.sender, "You are the second highest bidder, bid amount is not reclaimable.");
        require(!reclaimedBidsForAuction[auctionId][msg.sender], "Bid amount already reclaimed.");

        reclaimedBidsForAuction[auctionId][msg.sender] = true;
        Bid memory bid = auctionBids[auctionId].bids[msg.sender];

        payable(msg.sender).transfer(bid.amount);
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
            0,
            address(0),
            false
        );
    }

    // TODO Remove this
    function changeEndTime(uint endTime) external {
        Auction storage auction = auctions[_auctionId];
        auction.endTime = endTime;
    }

    function onlyOwner() internal view {
        require(msg.sender == owner, "Only owner can call this function.");
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