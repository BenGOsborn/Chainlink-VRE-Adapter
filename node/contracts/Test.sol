pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private linkAddress;
    uint256 public result;

    constructor(address linkAddress_) {
        linkAddress = linkAddress_;
        setChainlinkToken(linkAddress);
    }

    function callRequest(string memory _jobId, address _oracle, uint256 _linkFee) public {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
        req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        req.add("path", "USD");
        req.addInt("times", 100);
        sendChainlinkRequestTo(_oracle, req, _linkFee);
    }

    function fulfill(bytes32 _requestId, uint256 _response) public recordChainlinkFulfillment(_requestId) {
        result = _response;
    }

    function withdrawLink() public {
        IERC20(linkAddress).transfer(msg.sender, IERC20(linkAddress).balanceOf(address(this)));
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 _result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            _result := mload(add(source, 32))
        }
  }
}