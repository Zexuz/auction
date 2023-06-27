import {Address} from "wagmi";

export const getAuctionContractConfig = () => {
    const address = process.env.NEXT_PUBLIC_AUCTION_ADDRESS as Address;
    if (!address) {
        throw new Error('NEXT_PUBLIC_AUCTION_ADDRESS is not set');
    }

    return {
        address: address,
        abi: auctionContractConfig["abi"]
    };
};
const auctionContractConfig = {
    address: process.env.NEXT_PUBLIC_AUCTION_ADDRESS,
    "_format": "hh-sol-artifact-1",
    "contractName": "Auction",
    "sourceName": "contracts/Auction.sol",
    "abi": [
        {
            "inputs": [],
            "stateMutability": "payable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "durationIncreaseInSecondsPerBid",
                    "type": "uint256"
                }
            ],
            "name": "AuctionStared",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                }
            ],
            "name": "BidPlaced",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                }
            ],
            "name": "bid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                }
            ],
            "name": "getAuction",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "startTime",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "endTime",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "durationIncreaseInSecondsPerBid",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "highestBid",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "highestBidder",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "ended",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Auctioneer.Auction",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAuctionId",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                }
            ],
            "name": "getBidForAuction",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "bidder",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct Auctioneer.Bid",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                }
            ],
            "name": "getBidsKeyForAuction",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "auctionId",
                    "type": "uint256"
                }
            ],
            "name": "settle",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    "bytecode": "0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060006001819055506107908061005b6000396000f3fe60806040526004361061004a5760003560e01c8063571a26a01461004f5780636b64c7691461009357806378bd79351461009d5780638da5cb5b146100da578063cdc90bfe14610105575b600080fd5b34801561005b57600080fd5b506100766004803603810190610071919061049f565b610130565b60405161008a989796959493929190610537565b60405180910390f35b61009b6101a5565b005b3480156100a957600080fd5b506100c460048036038101906100bf919061049f565b61027e565b6040516100d19190610684565b60405180910390f35b3480156100e657600080fd5b506100ef610359565b6040516100fc91906106c1565b60405180910390f35b34801561011157600080fd5b5061011a61037d565b60405161012791906106dc565b60405180910390f35b60026020528060005260406000206000915090508060000154908060010154908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060160149054906101000a900460ff16905088565b60006101b034610387565b90508060000151600181905550806002600083600001518152602001908152602001600020600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e08201518160060160146101000a81548160ff02191690831515021790555090505050565b610286610407565b60026000838152602001908152602001600020604051806101000160405290816000820154815260200160018201548152602001600282015481526020016003820154815260200160048201548152602001600582015481526020016006820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016006820160149054906101000a900460ff1615151515815250509050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600154905090565b61038f610407565b604051806101000160405280600180546103a99190610726565b8152602001838152602001428152602001610e10426103c89190610726565b815260200161012c815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600015158152509050919050565b604051806101000160405280600081526020016000815260200160008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000151581525090565b600080fd5b6000819050919050565b61047c81610469565b811461048757600080fd5b50565b60008135905061049981610473565b92915050565b6000602082840312156104b5576104b4610464565b5b60006104c38482850161048a565b91505092915050565b6104d581610469565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610506826104db565b9050919050565b610516816104fb565b82525050565b60008115159050919050565b6105318161051c565b82525050565b60006101008201905061054d600083018b6104cc565b61055a602083018a6104cc565b61056760408301896104cc565b61057460608301886104cc565b61058160808301876104cc565b61058e60a08301866104cc565b61059b60c083018561050d565b6105a860e0830184610528565b9998505050505050505050565b6105be81610469565b82525050565b6105cd816104fb565b82525050565b6105dc8161051c565b82525050565b610100820160008201516105f960008501826105b5565b50602082015161060c60208501826105b5565b50604082015161061f60408501826105b5565b50606082015161063260608501826105b5565b50608082015161064560808501826105b5565b5060a082015161065860a08501826105b5565b5060c082015161066b60c08501826105c4565b5060e082015161067e60e08501826105d3565b50505050565b60006101008201905061069a60008301846105e2565b92915050565b60006106ab826104db565b9050919050565b6106bb816106a0565b82525050565b60006020820190506106d660008301846106b2565b92915050565b60006020820190506106f160008301846104cc565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061073182610469565b915061073c83610469565b9250828201905080821115610754576107536106f7565b5b9291505056fea2646970667358221220378db36b2f9c3a4717ecb44d88ad05e862cb99316e0dad8f345495a6c7daad4a64736f6c63430008120033",
    "deployedBytecode": "0x60806040526004361061004a5760003560e01c8063571a26a01461004f5780636b64c7691461009357806378bd79351461009d5780638da5cb5b146100da578063cdc90bfe14610105575b600080fd5b34801561005b57600080fd5b506100766004803603810190610071919061049f565b610130565b60405161008a989796959493929190610537565b60405180910390f35b61009b6101a5565b005b3480156100a957600080fd5b506100c460048036038101906100bf919061049f565b61027e565b6040516100d19190610684565b60405180910390f35b3480156100e657600080fd5b506100ef610359565b6040516100fc91906106c1565b60405180910390f35b34801561011157600080fd5b5061011a61037d565b60405161012791906106dc565b60405180910390f35b60026020528060005260406000206000915090508060000154908060010154908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060160149054906101000a900460ff16905088565b60006101b034610387565b90508060000151600181905550806002600083600001518152602001908152602001600020600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e08201518160060160146101000a81548160ff02191690831515021790555090505050565b610286610407565b60026000838152602001908152602001600020604051806101000160405290816000820154815260200160018201548152602001600282015481526020016003820154815260200160048201548152602001600582015481526020016006820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016006820160149054906101000a900460ff1615151515815250509050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600154905090565b61038f610407565b604051806101000160405280600180546103a99190610726565b8152602001838152602001428152602001610e10426103c89190610726565b815260200161012c815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600015158152509050919050565b604051806101000160405280600081526020016000815260200160008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000151581525090565b600080fd5b6000819050919050565b61047c81610469565b811461048757600080fd5b50565b60008135905061049981610473565b92915050565b6000602082840312156104b5576104b4610464565b5b60006104c38482850161048a565b91505092915050565b6104d581610469565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610506826104db565b9050919050565b610516816104fb565b82525050565b60008115159050919050565b6105318161051c565b82525050565b60006101008201905061054d600083018b6104cc565b61055a602083018a6104cc565b61056760408301896104cc565b61057460608301886104cc565b61058160808301876104cc565b61058e60a08301866104cc565b61059b60c083018561050d565b6105a860e0830184610528565b9998505050505050505050565b6105be81610469565b82525050565b6105cd816104fb565b82525050565b6105dc8161051c565b82525050565b610100820160008201516105f960008501826105b5565b50602082015161060c60208501826105b5565b50604082015161061f60408501826105b5565b50606082015161063260608501826105b5565b50608082015161064560808501826105b5565b5060a082015161065860a08501826105b5565b5060c082015161066b60c08501826105c4565b5060e082015161067e60e08501826105d3565b50505050565b60006101008201905061069a60008301846105e2565b92915050565b60006106ab826104db565b9050919050565b6106bb816106a0565b82525050565b60006020820190506106d660008301846106b2565b92915050565b60006020820190506106f160008301846104cc565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061073182610469565b915061073c83610469565b9250828201905080821115610754576107536106f7565b5b9291505056fea2646970667358221220378db36b2f9c3a4717ecb44d88ad05e862cb99316e0dad8f345495a6c7daad4a64736f6c63430008120033",
    "linkReferences": {},
    "deployedLinkReferences": {}
}
