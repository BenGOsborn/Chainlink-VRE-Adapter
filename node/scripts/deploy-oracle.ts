import hre from "hardhat";
import fs from "fs";
import addresses from "../address.json";

async function main() {
    // Deploy the contract
    await hre.run("compile");
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const linkAddress = addresses.linkAddress;
    const oracle = await Oracle.deploy(linkAddress);
    await oracle.deployed();
    console.log(`Deployed oracle to: https://rinkeby.etherscan.io/address/${oracle.address}`);
    addresses.oracleAddress = oracle.address;

    // Approve the Oracle operator address to the contract
    const nodeAddress = addresses.nodeAddress;
    await oracle.setFulfillmentPermission(nodeAddress, true);
    console.log(`Approved ${nodeAddress} as a node operator`);

    // Fund the Oracle operator
    const signer = hre.ethers.provider.getSigner();
    const amount = 0.01;
    await signer.sendTransaction({
        to: nodeAddress,
        value: hre.ethers.utils.parseEther(amount.toString()),
    });

    // Save the addresses to the file
    fs.writeFileSync("address.json", JSON.stringify(addresses));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
