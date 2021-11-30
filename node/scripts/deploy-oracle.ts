import hre from "hardhat";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    // Deploy the contract
    await hre.run("compile");
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const LINK_ADDRESS = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    const oracle = await Oracle.deploy(LINK_ADDRESS);
    await oracle.deployed();
    console.log(`Deployed oracle to: https://rinkeby.etherscan.io/address/${oracle.address}`);

    // Approve the Oracle address to the contract
    const nodeAddress = process.env.NODE_ADDRESS as string;
    await oracle.setFulfillmentPermission(nodeAddress, true);
    console.log(`Approved ${nodeAddress} as a node operator`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
