// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Auction {
    uint private constant FIVE_MINUTES_IN_SECONDS = 60 * 5;
    uint private constant ONE_HOUR_IN_SECONDS = 60 * 60;

    address payable public owner;

    uint private _auctionId;

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

    mapping(uint => Auction) public auctions;

    constructor() payable {
        owner = payable(msg.sender);
        _auctionId = 0;
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

    function getAuctionId() public view returns (uint) {
        return _auctionId;
    }

}