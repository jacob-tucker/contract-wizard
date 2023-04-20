import FungibleToken from "./utility/FungibleToken.cdc"

pub contract ExampleToken: FungibleToken {

    pub var totalSupply: UFix64
    
    pub let VaultStoragePath: StoragePath
    pub let VaultPublicPath: PublicPath
    pub let ReceiverPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <- create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault: @Vault <- from as! @Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        init(balance: UFix64) {
            self.balance = balance
        }

        destroy() {
            if self.balance > 0.0 {
                ExampleToken.totalSupply = ExampleToken.totalSupply - self.balance
            }
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Minter {
        pub fun mintTokens(amount: UFix64): @Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
            }
            ExampleToken.totalSupply = ExampleToken.totalSupply + amount
            return <- create Vault(balance: amount)
        }
    }

    init() {
        self.totalSupply = 1000.0
        self.VaultStoragePath = /storage/ExampleTokenVault
        self.VaultPublicPath = /public/ExampleTokenMetadata
        self.ReceiverPublicPath = /public/ExampleTokenReceiver
        self.MinterStoragePath = /storage/ExampleTokenMinter

        self.account.save(<- create Vault(balance: self.totalSupply), to: self.VaultStoragePath)

        self.account.link<&Vault{FungibleToken.Receiver}>(
            self.ReceiverPublicPath,
            target: self.VaultStoragePath
        )

        self.account.link<&Vault{FungibleToken.Balance}>(
            self.VaultPublicPath,
            target: self.VaultStoragePath
        )

        self.account.save(<- create Minter(), to: self.MinterStoragePath)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}