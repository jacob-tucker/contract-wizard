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

- FTView
  - name
  - symbol
  - description
  - logo link
  - socials
  - url
- FTDisplay
  - name
  - symbol
  - description
  - logo link
  - socials
  - url
- FTVaultData

If any are turned on, add the `FungibleTokenMetadataViews` import and implement them on `Vault`.
For each one that is on, add that MetadataView.

---

### Events

Type: list of non-exclusive options that are each an on/off toggle

- TokensBurned
- Tokens Minted

---

### Minting

Type: list of exclusive options

1. Only owner mint
2. Owner + whoever owner wants to give access to
3. Public minting

#### [*If 1 or 2 is selected*] Allowed Amount

Type: on/off toggle

If on, put input field for the amount they should be allowed

#### [*If 2 or 3 is selected*] Pausable

Type: on/off toggle

#### [*If 3 is selected*] Purchase

Type: list of exclusive options (pick 1)

1. User purchases pre-defined prices
2. User sends in any amount of payment and token are calculated

---

### Supply

Type: on/off toggle for each

If on, put input field

- Initial Supply
- Max supply