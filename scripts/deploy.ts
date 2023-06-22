import {ethers} from "hardhat";

async function main() {
    const auction = await ethers.deployContract("Auctioneer", {
        value: ethers.parseEther("0.001"),
    });

    const res = await auction.waitForDeployment();

    writeToEnvFile("LOCK_ADDRESS", auction.address);

    console.log("Deployed to:", auction.address);
}

function writeToEnvFile(lockaddress: string, address:string) {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(__dirname, "../.env");
    const envExists = fs.existsSync(envPath);

    if (envExists) {
        const env = fs.readFileSync(envPath).toString();
        const envLines = env.split("\n");
        const newEnvLines = envLines.map((line:string) => {
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
