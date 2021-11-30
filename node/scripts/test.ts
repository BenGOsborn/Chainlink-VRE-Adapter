import hre from "hardhat";
import TestABI from "../artifacts/contracts/Test.sol/Test.json";
import addresses from "../address.json";

async function main() {
    // Initialize the contract
    const signer = hre.ethers.provider.getSigner();
    const test = new hre.ethers.Contract(addresses.testAddress, TestABI.abi, signer);
    console.log(`Initialized Test contract from ${addresses.testAddress}`);

    // Request the code to be called
    const jobId = "f2ee4834-d2be-40d4-9dc4-ab3da8e8e3e9".replace(/-/g, "");
    const oracleAddress = addresses.oracleAddress;
    const linkFee = "1";

    await test.callRequest(jobId, oracleAddress, linkFee);
    console.log("Made request for data");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
