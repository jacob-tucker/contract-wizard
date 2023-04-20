# Core

`ExampleNFT.cdc` - the bare minimum (+ some niceties like paths)

## Categories

The following are a list of categories that the user will encounter:

### Contract Views

Type: on/off toggle

If on, add the `ViewResolver` import 

### Metadata Views

Type: list of non-exclusive options that are each an on/off toggle

- Display
- NFTCollectionDisplay
- NFTCollectionData
- Royalties
- ExternalURL

If any are turned on, add the `MetadataViews` import and implement them on `NFT` and `Collection`. Also add the `resolveView` and `getViews` functions on the `NFT` resource.
For each one that is on, add that MetadataView.

### Minting

Type: list of exclusive options (pick 1)

1. Only owner mint
2. Owner + whoever owner wants to give access to
3. Public minting

### Purchase

Type: list of exclusive options (pick 1)

Note: If this is turned on, then auto-set **Minting** to "Public minting".

1. User purchase an NFT of their choice
2. User purchase an NFT where they don't know the metadata

### NFT Metadata

Type: list of non-exclusive options

- Add sequential serials to NFTs
- [Component that allows users to add key-value pairs]
