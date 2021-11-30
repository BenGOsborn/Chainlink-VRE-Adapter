// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Test is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
    uint256 public currentPrice;

    constructor(address linkAddress_) {
        setChainlinkToken(linkAddress_);
    }

    function requestEthereumPrice(address _oracle, string memory _jobId) public {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
        req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        req.add("path", "USD");
        req.addInt("times", 100);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
        currentPrice = _price;
    }

    function withdrawLink() public {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}