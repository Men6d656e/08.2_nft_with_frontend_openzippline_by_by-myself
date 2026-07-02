// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFToken
/// @notice An ERC-721 token contract with minting, enumeration, and metadata storage
/// @dev Uses OpenZeppelin v5.x: ERC721 + ERC721Enumerable + ERC721URIStorage + Ownable
contract NFToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    // -----------------------------------------------------------------------
    //  Errors
    // -----------------------------------------------------------------------

    /// @dev Reverts when minting to the zero address
    error NFToken__MintToZeroAddress();

    /// @dev Reverts when a token does not exist
    error NFToken__TokenDoesNotExist(uint256 tokenId);

    // -----------------------------------------------------------------------
    //  State
    // -----------------------------------------------------------------------

    /// @notice Auto-incrementing token ID counter
    uint256 private _nextTokenId;

    // -----------------------------------------------------------------------
    //  Constructor
    // -----------------------------------------------------------------------

    /// @param _name   Collection name
    /// @param _symbol Collection symbol
    /// @param _initialOwner Initial owner who receives the Ownable role
    constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        _nextTokenId = 1;
    }

    // -----------------------------------------------------------------------
    //  Minting
    // -----------------------------------------------------------------------

    /// @notice Mint a new token to `to` with the given `uri` (onlyOwner)
    /// @param  to  Recipient address
    /// @param  uri Token metadata URI (can be ipfs://, data URI, or HTTP)
    /// @return tokenId The ID of the newly minted token
    function mint(address to, string memory uri) external onlyOwner returns (uint256) {
        if (to == address(0)) revert NFToken__MintToZeroAddress();

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    // -----------------------------------------------------------------------
    //  Burn
    // -----------------------------------------------------------------------

    /// @notice Burn a token. The caller must be the token owner or an approved operator.
    /// @param  tokenId The ID of the token to burn
    function burn(uint256 tokenId) external {
        _update(address(0), tokenId, _msgSender());
    }

    // -----------------------------------------------------------------------
    //  ERC-165 Interface Support
    // -----------------------------------------------------------------------

    /// @inheritdoc ERC721URIStorage
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // -----------------------------------------------------------------------
    //  Hooks — required by inherited contracts
    // -----------------------------------------------------------------------

    /// @inheritdoc ERC721Enumerable
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /// @inheritdoc ERC721Enumerable
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    // -----------------------------------------------------------------------
    //  Token URI — required by ERC721URIStorage
    // -----------------------------------------------------------------------

    /// @inheritdoc ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if (tokenId < 1 || tokenId >= _nextTokenId) revert NFToken__TokenDoesNotExist(tokenId);
        return super.tokenURI(tokenId);
    }
}
