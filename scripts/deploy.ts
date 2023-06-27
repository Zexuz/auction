import {ethers} from "hardhat";

async function main() {
    const Factory = await ethers.getContractFactory("Auctioneer");
    const auction = await Factory.deploy({value: ethers.parseEther("0.001")});

    const res = await auction.waitForDeployment();

    const address = await res.getAddress()

    writeToEnvFile("NEXT_PUBLIC_AUCTION_ADDRESS", address);

    console.log("Deployed to:", address);
}

function writeToEnvFile(lockaddress: string, address: string) {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(__dirname, "../app/.env");
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
