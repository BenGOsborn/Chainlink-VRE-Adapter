import hre from "hardhat";
import ERC20Abi from "@openzeppelin/contracts/build/contracts/ERC20.json";
import fs from "fs";
import addresses from "../address.json";

async function main() {
    // Deploy the contract
    await hre.run("compile");
    const Test = await hre.ethers.getContractFactory("Test");
    const linkAddress = addresses.linkAddress;
    const test = await Test.deploy(linkAddress);
    await test.deployed();
    console.log(`Deployed test to: https://rinkeby.etherscan.io/address/${test.address}`);
    addresses.testAddress = test.address;

    // Fund the contract with LINK
    const signer = hre.ethers.provider.getSigner();
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20Abi.abi, signer);
    const LINK_AMOUNT = "100";
    await link.transfer(test.address, LINK_AMOUNT);
    console.log(`Transferred ${LINK_AMOUNT} LINK`);

    // Save the addresses to a file
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
