import hre from "hardhat";
import ERC20Abi from "@openzeppelin/contracts/build/contracts/ERC20.json";

async function main() {
    // Deploy the contract
    const Test = await hre.ethers.getContractFactory("Test");
    const LINK_ADDRESS = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    const test = await Test.deploy(LINK_ADDRESS);
    await test.deployed();
    console.log(`Deployed test to: https://rinkeby.etherscan.io/address/${test.address}`);

    // Fund the contract with LINK
    const signer = hre.ethers.provider.getSigner();
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20Abi.abi, signer);
    const LINK_AMOUNT = "100";
    await link.transfer(test.address, LINK_AMOUNT);
    console.log(`Transferred ${LINK_AMOUNT} LINK`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
