// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {NFToken} from "../src/NFToken.sol";

/// @title DeployNFToken
/// @notice Deploy the NFToken contract with interactive or env-based key entry
contract DeployNFToken is Script {
    function run() external {
        // --- Private key resolution ---
        uint256 deployerPrivateKey = _resolvePrivateKey();
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deployer address:", deployer);

        // --- Deployment ---
        vm.startBroadcast(deployerPrivateKey);

        NFToken nft = new NFToken("NFToken", "NFT", deployer);

        vm.stopBroadcast();

        // --- Post-deploy info ---
        console.log("Contract address:", address(nft));
        console.log("Name: NFToken");
        console.log("Symbol: NFT");
        console.log("Owner:", deployer);
    }

    /// @dev Resolve private key from env var `PRIVATE_KEY`, falling back to interactive prompt
    function _resolvePrivateKey() internal returns (uint256) {
        string memory pkEnv = vm.envOr("PRIVATE_KEY", string(""));
        if (bytes(pkEnv).length > 0) {
            return vm.parseUint(_ensureHexPrefix(pkEnv));
        }
        // Interactive — secure prompt hides input
        string memory promptResult = vm.promptSecret("Enter deployer private key");
        return vm.parseUint(_ensureHexPrefix(promptResult));
    }

    /// @dev Ensure the string has a 0x prefix (required by vm.parseUint for hex)
    function _ensureHexPrefix(string memory s) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        if (b.length >= 2 && b[0] == "0" && (b[1] == "x" || b[1] == "X")) {
            return s;
        }
        return string(abi.encodePacked("0x", s));
    }
}
