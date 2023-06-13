// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Auctioneer.sol";
import "./AuctioneerInterface.sol";
import "hardhat/console.sol";


contract Token is ERC20 {
    address public governance;

    uint public constant INIT_MINT_PER_AUCTION = 100000;
    uint public constant DECAY_RATE_PERCENT = 2;
    uint public constant MINIMUM_MINT_PER_AUCTION = 1000;

    constructor(address _governance) public ERC20("WAG Token", "WAG") {
        governance = _governance;
    }

    function mint(address account, uint256 amount) external {
        require(msg.sender == governance, "Only governance can mint");
        _mint(account, amount);
    }

    function mintFromAuction(address auctionContract, uint256 auctionId, uint256 bid) public {
        Auctioneer auctioneer = Auctioneer(auctionContract);
        Auctioneer.Auction memory auction = auctioneer.getAuction(auctionId);

        require(auction.id != 0, "Auction does not exist.");
        require(auction.ended, "Auction has not ended.");

        Auctioneer.Bid memory senderBid = auctioneer.getBidForAuction(auctionId, msg.sender);
        require(senderBid.bidder != address(0), "Bidder does not exist.");

        //        address[] memory bids = auctioneer.getBidsKeyForAuction(auctionId);
        //
        //        uint tokensMinted = INIT_MINT_PER_AUCTION * (DECAY_RATE_PERCENT ** (auctionId - 1));
        //
        //        uint256 amount = (senderBid.amount / totalValue) * tokensMinted;
        //
        //        if (amount < MINIMUM_MINT_PER_AUCTION) {
        //            amount = MINIMUM_MINT_PER_AUCTION;
        //        }
        //
        //        _mint(senderBid.bidder, amount);
    }

    function calculateTokenDistribution(uint auctionId, uint bid, uint totalValue) public view returns (uint256) {

        console.log("DECAY_RATE_PERCENT ** (auctionId - 1) = %s", DECAY_RATE_PERCENT ** (auctionId - 1));
        uint256 tokensMinted = INIT_MINT_PER_AUCTION * (DECAY_RATE_PERCENT ** (auctionId - 1));
        console.log("tokensMinted: %s", tokensMinted);

        uint256 amount = tokensMinted * bid / totalValue;


        if (amount < MINIMUM_MINT_PER_AUCTION) {
            amount = MINIMUM_MINT_PER_AUCTION;
        }

        return amount;
    }

    function changeGovernanceAddress(address _newGovernance) external {
        require(msg.sender == governance, "Only governance can change the governance address");
        governance = _newGovernance;
    }
}