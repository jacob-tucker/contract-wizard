# Core

`ExampleNFT.cdc` - the bare minimum (+ some niceties like paths)

## Categories

The following are a list of categories that the user will encounter:

---

### Contract Views

Type: on/off toggle

If on, add the `ViewResolver` import 

---

### Metadata Views

Type: list of non-exclusive options that are each an on/off toggle

- Display
  - name
  - description
  - image url
- NFTCollectionDisplay
  - name
  - description
  - logo link
  - socials
  - url
- NFTCollectionData
- Royalties
  - list of % and address
- ExternalURL
  - url

If any are turned on, add the `MetadataViews` import and implement them on `NFT` and `Collection`. Also add the `resolveView` and `getViews` functions on the `NFT` resource.
For each one that is on, add that MetadataView.

---

### Minting

Type: list of exclusive options (pick 1)

1. Only owner mint
2. Owner + whoever owner wants to give access to
3. Public minting

#### [*If 2 or 3 is selected*] Pausable

Type: on/off toggle

#### [*If 3 is selected*] Purchase

Type: on/off toggle

---

### NFT Metadata

Type: list of non-exclusive options

- Add sequential serials to NFTs
- [Component that allows users to add key-value pairs]

---

### Soulbound

Type: on/off toggle
