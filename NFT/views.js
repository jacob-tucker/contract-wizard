export class NFTCollectionData {
  storagePath
  publicPath
  providerPath

  getViewType() {
    return 'Type<MetadataViews.NFTCollectionData>()'
  }

  getReturn() {
    return `
    return MetadataViews.NFTCollectionData(
      storagePath: ${this.storagePath},
      publicPath: ${this.publicPath},
      providerPath: ${this.providerPath}
    )
    `
  }

  constructor(contractName) {
    this.storagePath = contractName + '.CollectionStoragePath'
    this.publicPath = contractName + '.CollectionPublicPath'
    this.providerPath = '/private/' + contractName + 'Collection'
  }
}

export class NFTCollectionDisplay {
  name
  description
  externalURL

  getViewType() {
    return 'Type<MetadataViews.NFTCollectionDisplay>()'
  }

  getReturn() {
    return `
    return MetadataViews.NFTCollectionDisplay(
      name: ${this.name},
      description: ${this.description},
      externalURL: ${this.externalURL}
    )
    `
  }

  constructor(name, description, externalURL) {
    this.name = name
    this.description = description
    this.externalURL = externalURL
    // this.squareImage = squareImage
    // this.bannerImage = bannerImage
    // this.socials = socials
  }
}