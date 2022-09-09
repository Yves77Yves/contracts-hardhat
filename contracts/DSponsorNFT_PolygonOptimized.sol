// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./DSponsorNFT.sol";

contract DSponsorNFT_PolygonOptimized is DSponsorNFT {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        address controller,
        address payable treasury
    ) DSponsorNFT(name, symbol, maxSupply, controller, treasury) {}

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        /* @dev On Polygon (Main Network), if OpenSea's ERC721 Proxy Address is detected,
         * auto-return true. Otherwise, use the default ERC721.isApprovedForAll()
         * See https://docs.opensea.io/docs/polygon-basic-integration
         */
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        return ERC721.isApprovedForAll(_owner, _operator);
    }
}
