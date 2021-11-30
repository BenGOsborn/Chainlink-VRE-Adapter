import hre from "hardhat";
import fs from "fs";
import addresses from "../address.json";

async function main() {
    // Deploy the contract
    await hre.run("compile");
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const LINK_ADDRESS = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    const oracle = await Oracle.deploy(LINK_ADDRESS);
    await oracle.deployed();
    console.log(`Deployed oracle to: https://rinkeby.etherscan.io/address/${oracle.address}`);
    addresses.oracleAddress = oracle.address;

    // Approve the Oracle address to the contract
    const nodeAddress = addresses.nodeAddress;
    await oracle.setFulfillmentPermission(nodeAddress, true);
    console.log(`Approved ${nodeAddress} as a node operator`);

    // Save the addresses to the file
    fs.writeFileSync("../address.json", JSON.stringify(addresses)); // **** THIS IS NOT UPDATING ANYTHING - WHY
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
