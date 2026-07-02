// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {NFToken} from "../src/NFToken.sol";

contract NFTokenTest is Test {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    NFToken public nft;
    address public owner = address(0x1234);
    address public user1 = address(0x5678);
    address public user2 = address(0x9abc);
    address public user3 = address(0xdef0);

    string public constant TEST_URI = "ipfs://QmTest123/metadata.json";

    // Helper: mint a token
    function _mint(address to, string memory uri) internal returns (uint256) {
        vm.prank(owner);
        return nft.mint(to, uri);
    }

    function setUp() public {
        vm.prank(owner);
        nft = new NFToken("NFToken", "NFT", owner);
    }

    // ================================================================
    // Constructor & Initialization Tests
    // ================================================================

    function test_Constructor_Name() public view {
        assertEq(nft.name(), "NFToken");
    }

    function test_Constructor_Symbol() public view {
        assertEq(nft.symbol(), "NFT");
    }

    function test_Constructor_Owner() public view {
        assertEq(nft.owner(), owner);
    }

    function test_Constructor_InitialSupplyIsZero() public view {
        assertEq(nft.totalSupply(), 0);
    }

    function test_Constructor_OwnerCannotBeZero() public {
        vm.expectRevert();
        new NFToken("Test", "TST", address(0));
    }

    // ================================================================
    // Minting Tests
    // ================================================================

    function test_Mint_Basic() public {
        vm.prank(owner);
        uint256 tokenId = nft.mint(user1, TEST_URI);

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.tokenURI(tokenId), TEST_URI);
        assertEq(nft.totalSupply(), 1);
    }

    function test_Mint_IncrementsTokenIds() public {
        uint256 t1 = _mint(user1, TEST_URI);
        uint256 t2 = _mint(user2, "ipfs://QmSecond/metadata.json");
        uint256 t3 = _mint(user1, "ipfs://QmThird/metadata.json");

        assertEq(t1, 1);
        assertEq(t2, 2);
        assertEq(t3, 3);
        assertEq(nft.totalSupply(), 3);
    }

    function test_Mint_EmitsTransferEvent() public {
        vm.prank(owner);
        vm.expectEmit(true, true, false, true);
        emit Transfer(address(0), user1, 1);
        nft.mint(user1, TEST_URI);
    }

    function test_Mint_ToZeroAddressReverts() public {
        vm.prank(owner);
        vm.expectRevert(NFToken.NFToken__MintToZeroAddress.selector);
        nft.mint(address(0), TEST_URI);
    }

    function test_Mint_NonOwnerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1)
        );
        nft.mint(user1, TEST_URI);
    }

    function test_Mint_EmptyStringUri() public {
        uint256 tokenId = _mint(user1, "");
        assertEq(tokenId, 1);
        assertEq(nft.tokenURI(tokenId), "");
    }

    // ================================================================
    // Ownership Tests
    // ================================================================

    function test_Ownership_OwnerCanMint() public {
        _mint(user1, TEST_URI);
        assertEq(nft.totalSupply(), 1);
    }

    function test_Ownership_NonOwnerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.mint(user1, TEST_URI);
    }

    function test_Ownership_Transfer() public {
        vm.prank(owner);
        nft.transferOwnership(user1);

        assertEq(nft.owner(), user1);

        // Old owner can no longer mint
        vm.prank(owner);
        vm.expectRevert();
        nft.mint(user1, TEST_URI);

        // New owner can mint
        vm.prank(user1);
        uint256 tokenId = nft.mint(user1, TEST_URI);
        assertEq(tokenId, 1);
    }

    function test_Ownership_Renounce() public {
        vm.prank(owner);
        nft.renounceOwnership();

        assertEq(nft.owner(), address(0));

        // No one can mint after renounce
        vm.prank(owner);
        vm.expectRevert();
        nft.mint(user1, TEST_URI);
    }

    // ================================================================
    // Transfer Tests
    // ================================================================

    function test_Transfer_NormalTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        nft.transferFrom(owner, user1, tokenId);

        assertEq(nft.ownerOf(tokenId), user1);
    }

    function test_Transfer_SafeTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        nft.safeTransferFrom(owner, user1, tokenId);

        assertEq(nft.ownerOf(tokenId), user1);
    }

    function test_Transfer_SafeTransferToContract() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        vm.expectRevert();
        nft.safeTransferFrom(owner, address(nft), tokenId);
    }

    function test_Transfer_NonOwnerCannotTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(user1);
        vm.expectRevert();
        nft.transferFrom(owner, user1, tokenId);
    }

    function test_Transfer_ApprovedCanTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        nft.approve(user1, tokenId);

        vm.prank(user1);
        nft.transferFrom(owner, user2, tokenId);

        assertEq(nft.ownerOf(tokenId), user2);
    }

    // ================================================================
    // Approval Tests
    // ================================================================

    function test_Approve_SingleToken() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        nft.approve(user1, tokenId);

        assertEq(nft.getApproved(tokenId), user1);
    }

    function test_Approve_Reset() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.startPrank(owner);
        nft.approve(user1, tokenId);
        nft.approve(address(0), tokenId);
        vm.stopPrank();

        assertEq(nft.getApproved(tokenId), address(0));
    }

    function test_Approve_SetApprovalForAll() public {
        vm.prank(owner);
        nft.setApprovalForAll(user1, true);

        assertTrue(nft.isApprovedForAll(owner, user1));
    }

    function test_Approve_OperatorCanTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(owner);
        nft.setApprovalForAll(user1, true);

        vm.prank(user1);
        nft.transferFrom(owner, user2, tokenId);

        assertEq(nft.ownerOf(tokenId), user2);
    }

    function test_Approve_UnauthorizedCannotTransfer() public {
        uint256 tokenId = _mint(owner, TEST_URI);

        vm.prank(user1);
        vm.expectRevert();
        nft.transferFrom(owner, user2, tokenId);
    }

    // ================================================================
    // Balance Tests
    // ================================================================

    function test_Balance_SingleUser() public {
        _mint(user1, TEST_URI);
        _mint(user1, TEST_URI);

        assertEq(nft.balanceOf(user1), 2);
    }

    function test_Balance_MultipleUsers() public {
        _mint(user1, TEST_URI);
        _mint(user2, TEST_URI);
        _mint(user1, TEST_URI);

        assertEq(nft.balanceOf(user1), 2);
        assertEq(nft.balanceOf(user2), 1);
    }

    function test_Balance_ZeroForNewAddress() public view {
        assertEq(nft.balanceOf(user3), 0);
    }

    function test_Balance_AfterTransfer() public {
        uint256 tokenId = _mint(user1, TEST_URI);

        vm.prank(user1);
        nft.transferFrom(user1, user2, tokenId);

        assertEq(nft.balanceOf(user1), 0);
        assertEq(nft.balanceOf(user2), 1);
    }

    function test_Balance_ZeroAddressReverts() public {
        vm.expectRevert();
        nft.balanceOf(address(0));
    }

    // ================================================================
    // Enumeration Tests
    // ================================================================

    function test_TotalSupply_AfterMints() public {
        assertEq(nft.totalSupply(), 0);
        _mint(user1, TEST_URI);
        assertEq(nft.totalSupply(), 1);
        _mint(user2, TEST_URI);
        assertEq(nft.totalSupply(), 2);
    }

    function test_TokenByIndex() public {
        uint256 t1 = _mint(user1, TEST_URI);
        uint256 t2 = _mint(user2, TEST_URI);
        uint256 t3 = _mint(user1, TEST_URI);

        assertEq(nft.tokenByIndex(0), t1);
        assertEq(nft.tokenByIndex(1), t2);
        assertEq(nft.tokenByIndex(2), t3);
    }

    function test_TokenOfOwnerByIndex() public {
        uint256 t1 = _mint(user1, TEST_URI);
        _mint(user2, TEST_URI);
        uint256 t3 = _mint(user1, TEST_URI);

        assertEq(nft.tokenOfOwnerByIndex(user1, 0), t1);
        assertEq(nft.tokenOfOwnerByIndex(user1, 1), t3);
        assertEq(nft.tokenOfOwnerByIndex(user2, 0), 2);
    }

    function test_OwnerTokensCountMatchesBalance() public {
        _mint(user1, TEST_URI);
        _mint(user1, TEST_URI);
        _mint(user1, TEST_URI);

        uint256 balance = nft.balanceOf(user1);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = nft.tokenOfOwnerByIndex(user1, i);
            assertEq(nft.ownerOf(tokenId), user1);
        }
    }

    function test_Enumeration_AfterBurn() public {
        uint256 t1 = _mint(user1, TEST_URI);
        uint256 t2 = _mint(user2, TEST_URI);
        uint256 t3 = _mint(user1, TEST_URI);

        vm.prank(user1);
        nft.burn(t1);

        // After burn: user1's tokens in order
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.tokenOfOwnerByIndex(user1, 0), t3);

        // totalSupply decrements on burn
        assertEq(nft.totalSupply(), 2);
    }

    function test_Enumeration_OutOfBoundsReverts() public {
        vm.expectRevert();
        nft.tokenByIndex(0);
    }

    function test_Enumeration_OwnerOutOfBoundsReverts() public {
        vm.expectRevert();
        nft.tokenOfOwnerByIndex(user1, 0);
    }

    function test_Enumeration_BurnAndReMint() public {
        uint256 t1 = _mint(user1, TEST_URI);

        vm.prank(user1);
        nft.burn(t1);

        uint256 t2 = _mint(user1, TEST_URI);

        assertEq(nft.totalSupply(), 1);
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.tokenOfOwnerByIndex(user1, 0), t2);
    }

    // ================================================================
    // tokenURI Tests
    // ================================================================

    function test_TokenURI_InvalidTokenReverts() public {
        vm.expectRevert(
            abi.encodeWithSelector(NFToken.NFToken__TokenDoesNotExist.selector, 999)
        );
        nft.tokenURI(999);
    }

    // ================================================================
    // ERC-165 Tests
    // ================================================================

    function test_ERC165_SupportsERC721() public view {
        assertTrue(nft.supportsInterface(0x80ac58cd));
    }

    function test_ERC165_SupportsERC721Enumerable() public view {
        assertTrue(nft.supportsInterface(0x780e9d63));
    }

    // ================================================================
    // Fuzz Tests
    // ================================================================

    function testFuzz_Mint_AnyEOA(address to) public {
        vm.assume(to != address(0));
        vm.assume(to.code.length == 0);

        vm.prank(owner);
        uint256 tokenId = nft.mint(to, TEST_URI);

        assertEq(nft.ownerOf(tokenId), to);
        assertEq(nft.balanceOf(to), 1);
        assertEq(nft.totalSupply(), 1);
    }

    function testFuzz_Mint_RandomURI(string memory uri) public {
        vm.assume(bytes(uri).length < 4096);

        vm.prank(owner);
        uint256 tokenId = nft.mint(user1, uri);

        assertEq(nft.tokenURI(tokenId), uri);
    }

    function testFuzz_TotalSupply_Increments(address to) public {
        vm.assume(to != address(0));
        vm.assume(to.code.length == 0);

        vm.startPrank(owner);
        for (uint256 i = 0; i < 5; i++) {
            nft.mint(to, TEST_URI);
        }
        vm.stopPrank();

        assertEq(nft.totalSupply(), 5);
        assertEq(nft.balanceOf(to), 5);
    }

    function testFuzz_Mint_MultipleRecipients(address to1, address to2) public {
        vm.assume(to1 != address(0) && to2 != address(0));
        vm.assume(to1.code.length == 0);
        vm.assume(to2.code.length == 0);

        vm.startPrank(owner);
        nft.mint(to1, TEST_URI);
        nft.mint(to2, TEST_URI);
        nft.mint(to1, TEST_URI);
        vm.stopPrank();

        assertEq(nft.balanceOf(to1), 2);
        assertEq(nft.balanceOf(to2), 1);
        assertEq(nft.totalSupply(), 3);
    }

    function testFuzz_Mint_UnauthorizedReverts(address attacker) public {
        vm.assume(attacker != owner);

        vm.prank(attacker);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", attacker)
        );
        nft.mint(attacker, TEST_URI);
    }
}
