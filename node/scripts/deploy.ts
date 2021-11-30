import hre from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    // Deploy the contract
    await hre.run("compile");
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const LINK_ADDRESS = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"; // Change for your network of choice to deploy to
    const oracle = await Oracle.deploy(LINK_ADDRESS);
    await oracle.deployed();

    // Approve the contract
    const oracleAddress = process.env.ORACLE_ADDRESS as string;
    console.log("Greeter deployed to:", oracle.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
