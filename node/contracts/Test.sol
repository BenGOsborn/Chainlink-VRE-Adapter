pragma solidity 0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private linkAddress;
    uint256 public result;

    constructor(address linkAddress_) {
        linkAddress = linkAddress_;
        setChainlinkToken(linkAddress_);
    }

    function callRequest(string memory _jobId, address _oracle, uint256 _linkFee, string memory _version, string memory _code, string memory _packages) public returns (bytes32) {
        Chainlink.Request memory request = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
        request.add("version", _version);
        request.add("code", _code); // MUST OUTPUT JSON - JSON library is required
        request.add("packages", _packages);
        return sendChainlinkRequestTo(_oracle, request, _linkFee);
    }

    function fulfill(bytes32 _requestId, uint256 _response) public recordChainlinkFulfillment(_requestId) {
        result = _response;
    }

    function withdrawLink() public {
        IERC20(linkAddress).transfer(msg.sender, IERC20(linkAddress).balanceOf(address(this)));
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