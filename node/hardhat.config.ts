import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
dotenv.config();

// Load in environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const INFURA_URL = process.env.INFURA_URL as string;

export default {
    solidity: "0.7.3",
};
