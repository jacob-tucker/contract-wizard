import { AccessModifiers } from "./access-modifiers.js";
import { ContractBuilder } from "./builder.js";
import { Function, Resource, Variable } from "./classes.js";

function addCoreViews(c, options) {
  const resolveViewFunction = new Function('resolveView', 'AnyStruct?', [{ name: '_ view', type: 'Type' }]);
  const getViewsFunction = new Function('getViews', '[Type]');
  
  if (options.coreViews.nftCollectionData || options.coreViews.nftCollectionDisplay) {
      resolveViewFunction.addCode('switch view {');

      getViewsFunction.addCode('return [')

      if (options.coreViews.nftCollectionData) {
          resolveViewFunction.addCode('  case Type<MetadataViews.NFTCollectionData>():');
          resolveViewFunction.addCode('    storagePath: ExampleNFT.CollectionStoragePath');

          getViewsFunction.addCode('  Type<MetadataViews.NFTCollectionData>()')
      }

      resolveViewFunction.addCode('}');
      resolveViewFunction.addCode('return nil');

      getViewsFunction.addCode(']')
  }

  c.addFunction(resolveViewFunction);
  c.addFunction(getViewsFunction);
  c.addImport('import ViewResolver from 0x01');
  c.addContractInterface('ViewResolver')
}

function addNFT(c, options) {
  const totalSupply = new Variable('totalSupply', 'UInt64', AccessModifiers.pub, true, 0)
  const nftResource = new Resource(
    'NFT', 
    [new Variable('id', 'UInt64', AccessModifiers.pub, true, 'self.uuid')], 
    ['NonFungibleToken.INFT'], 
    undefined,
    ['ExampleNFT.totalSupply = ExampleNFT.totalSupply + 1']
  )

  if (options.metadata.sequentialIds) {
    nftResource.addVariable(new Variable('serial', 'UInt64', AccessModifiers.pub, true, 'ExampleNFT.totalSupply'))
  }
  c.addVariable(totalSupply)
  c.addResource(nftResource);
}

function addMetadataViews(c) {
  const nftResource = c.resources['NFT'];
  nftResource.addInterface('MetadataViews.Resolver')
}

function main() {
  const contractName = 'ExampleNFT';
  const contract = new ContractBuilder(contractName);

  const options = {
      coreViews: {
        enabled: true,
        nftCollectionData: true,
        nftCollectionDisplay: false
      },
      minting: {
        options: ['OWNER', 'OWNER_AND_ADMINS', 'PUBLIC'],
        selectedOption: 0,
        pausable: true,
        purchase: true
      },
      metadata: {
        sequentialIds: true,
        attributes: {}
      },
      metadataViews: ['Display']
  }
  
  contract.addContractInterface('NonFungibleToken')
  contract.addImport('import NonFungibleToken from 0x01')
  addNFT(contract, options);

  if (options.coreViews.enabled) {
    addCoreViews(contract, options)
  }

  if (options.metadataViews.length > 0) {
    addMetadataViews(contract, options)
  }

  console.log(contract.print())
}

main();