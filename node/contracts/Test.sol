pragma solidity 0.6.6;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test is ChainlinkClient {
    address private linkAddress;

    constructor(address linkAddress_) {
        linkAddress = linkAddress_;
        setChainlinkToken(linkAddress_);
    }

    function callRequest() {

    }

    function withdrawLink() {
        IERC20(linkAddress).transfer(msg.sender, IERC20(linkAddress).balanceOf(address(this)););
    }
}