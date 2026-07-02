import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NFToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nfTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_initialOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'uri', internalType: 'string', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_fromTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_toTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BatchMetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'ERC721EnumerableForbiddenBatchMint' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  {
    type: 'error',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721OutOfBoundsIndex',
  },
  { type: 'error', inputs: [], name: 'NFToken__MintToZeroAddress' },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'NFToken__TokenDoesNotExist',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__
 */
export const useReadNfToken = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadNfTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadNfTokenGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadNfTokenIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: nfTokenAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadNfTokenName = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadNfTokenOwner = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadNfTokenOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadNfTokenSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: nfTokenAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadNfTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const useReadNfTokenTokenByIndex = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'tokenByIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const useReadNfTokenTokenOfOwnerByIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: nfTokenAbi,
    functionName: 'tokenOfOwnerByIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadNfTokenTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadNfTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: nfTokenAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__
 */
export const useWriteNfToken = /*#__PURE__*/ createUseWriteContract({
  abi: nfTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteNfTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: nfTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteNfTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: nfTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteNfTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: nfTokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteNfTokenRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: nfTokenAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteNfTokenSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: nfTokenAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteNfTokenSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: nfTokenAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteNfTokenTransferFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: nfTokenAbi, functionName: 'transferFrom' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteNfTokenTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: nfTokenAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__
 */
export const useSimulateNfToken = /*#__PURE__*/ createUseSimulateContract({
  abi: nfTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateNfTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateNfTokenBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: nfTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateNfTokenMint = /*#__PURE__*/ createUseSimulateContract({
  abi: nfTokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateNfTokenRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateNfTokenSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateNfTokenSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateNfTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nfTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateNfTokenTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nfTokenAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__
 */
export const useWatchNfTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nfTokenAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchNfTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchNfTokenApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"BatchMetadataUpdate"`
 */
export const useWatchNfTokenBatchMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'BatchMetadataUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchNfTokenMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'MetadataUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchNfTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nfTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchNfTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nfTokenAbi,
    eventName: 'Transfer',
  })
