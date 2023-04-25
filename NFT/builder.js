import { CoreViews } from "./categories.js";

class NFTContract {
  contractName
  categories = []

  constructor(contractName) {
    this.contractName = contractName
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  print() {
    let code = `
    import NonFungibleToken from "./utility/NonFungibleToken.cdc"
    pub contract ExampleNFT: NonFungibleToken {

        pub var totalSupply: UInt64

        pub event ContractInitialized()
        pub event Withdraw(id: UInt64, from: Address?)
        pub event Deposit(id: UInt64, to: Address?)

        pub let CollectionStoragePath: StoragePath
        pub let CollectionPublicPath: PublicPath
        pub let MinterStoragePath: StoragePath

        pub resource NFT: NonFungibleToken.INFT {
            pub let id: UInt64
        
            init() {
                self.id = self.uuid
                ExampleNFT.totalSupply = ExampleNFT.totalSupply + 1
            }
        }

        pub resource interface CollectionPublic {
            pub fun deposit(token: @NonFungibleToken.NFT)
            pub fun getIDs(): [UInt64]
            pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
            pub fun borrowExampleNFT(id: UInt64): &NFT? {
                post {
                    (result == nil) || (result?.id == id):
                        "Cannot borrow ExampleNFT reference: the ID of the returned reference is incorrect"
                }
            }
        }

        pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
            pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

            pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
                let token: @NonFungibleToken.NFT <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
                emit Withdraw(id: token.id, from: self.owner?.address)
                return <- token
            }

            pub fun deposit(token: @NonFungibleToken.NFT) {
                let token: @NFT <- token as! @NFT
                emit Deposit(id: token.id, to: self.owner?.address)
                self.ownedNFTs[token.id] <-! token
            }

            pub fun getIDs(): [UInt64] {
                return self.ownedNFTs.keys
            }

            pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
                return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
            }
          
            pub fun borrowExampleNFT(id: UInt64): &NFT? {
                if self.ownedNFTs[id] != nil {
                    let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                    return ref as! &NFT
                }

                return nil
            }

            init () {
                self.ownedNFTs <- {}
            }

            destroy() {
                destroy self.ownedNFTs
            }
        }

        pub fun createEmptyCollection(): @NonFungibleToken.Collection {
            return <- create Collection()
        }

        pub resource Minter {
            pub fun mintNFT(): @NFT {
                var newNFT: @NFT <- create NFT()
                return <- newNFT
            }
        }

        ${this.categories.map(cat => cat.print())}

        init() {
            self.totalSupply = 0

            self.CollectionStoragePath = /storage/ExampleNFTCollection
            self.CollectionPublicPath = /public/ExampleNFTCollection
            self.MinterStoragePath = /storage/ExampleNFTMinter

            self.account.save(<- create Collection(), to: self.CollectionStoragePath)
            self.account.link<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, ExampleNFT.CollectionPublic}>(
                self.CollectionPublicPath,
                target: self.CollectionStoragePath
            )

            self.account.save(<- create Minter(), to: self.MinterStoragePath)

            emit ContractInitialized()
        }
    }
    `.replaceAll('ExampleNFT', this.contractName)

    return code;
  }
}
const contractName = 'ExampleNFT';
const contract = new NFTContract(contractName);

const coreViews = new CoreViews(contractName);
coreViews.addView(coreViews.viewOptions[0]);
coreViews.addView(coreViews.viewOptions[1]);

contract.addCategory(coreViews);

console.log(contract.print());