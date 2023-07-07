import {ethers} from "hardhat";
import {ContractTransactionResponse} from "ethers";
import {AuctioneerSimple} from "../typechain-types";

async function main() {
    const signers = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("AuctioneerSimple");
    const auction = await Factory.deploy({value: ethers.parseEther("0.001")});

    const res = await auction.waitForDeployment();

    const address = await res.getAddress()

    writeToEnvFile("NEXT_PUBLIC_AUCTION_ADDRESS", address);

    console.log("Deployed to:", address);

    await sleep(5 * 1000);
    await setupContractWithBids(auction, signers)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function setupContractWithBids(auction: AuctioneerSimple & {
    deploymentTransaction(): ContractTransactionResponse
}, signers: any[]) {

    const bid = (signer: any, auctionId: number, amount: string) => {
        return auction.connect(signer).bid(auctionId, {value: ethers.parseEther(amount)})
    };

    const auctionId = 1;

    bid(signers[0], auctionId, "0.02");
    await sleep(1000);
    bid(signers[1], auctionId, "0.03");
    await sleep(1000);
    bid(signers[2], auctionId, "0.04");
    await sleep(1000);
    bid(signers[0], auctionId, "0.03");
    await sleep(1000);
    bid(signers[1], auctionId, "0.03");
    await sleep(1000);
    bid(signers[2], auctionId, "0.05");
    await sleep(1000);
    bid(signers[10], auctionId, "1337.69");
    await sleep(1000);
    bid(signers[11], auctionId, "1355.69");
}


function writeToEnvFile(lockaddress: string, address: string) {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(__dirname, "../app/.env.local");
    const envExists = fs.existsSync(envPath);

    if (envExists) {
        const env = fs.readFileSync(envPath).toString();
        const envLines = env.split("\n");
        // TODO: check if key exists, if there is a new key, it will not be added
        const newEnvLines = envLines.map((line: string) => {
            const [key, value] = line.split("=");
            if (key === lockaddress) {
                return `${key}=${address}`;
            }
            return line;
        });
        fs.writeFileSync(envPath, newEnvLines.join("\n"));
    } else {
        fs.writeFileSync(envPath, `${lockaddress}=${address}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
