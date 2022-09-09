// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./DSponsorNFT_PolygonOptimized.sol";

/**
 * @title DSponsorNFT factory
 * @author Anthony Gourraud
 * @notice Create {DSponsorNFT} contracts
 */
contract DSponsorNFTFactory {
    function createDSponsorNFT(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        address controller,
        address payable treasury
    ) external returns (address) {
        return
            address(
                // @dev Should change contract file according to chain
                new DSponsorNFT_PolygonOptimized(
                    name,
                    symbol,
                    maxSupply,
                    controller,
                    treasury
                )
            );
    }
}
