import { AccessModifiers } from "./access-modifiers.js";
import { Function, Init, Resource, Variable } from "./utils.js";

class ContractBuilder {

  constructor(contractName) {
    this.contractName = contractName;
    this.resources = {};
    this.structs = [];
    this.functions = {};
    this.variables = [];
    this.contractInterfaces = ['NonFungibleToken'];
    this.imports = ['import NonFungibleToken from 0x01'];
  }

  addResource(r) {
    this.resources[r.name] = r;
  }

  addFunction(f) {
    this.functions[f.name] = f;
  }

  addImport(i) {
    this.imports.push(i);
  }

  addVariable(v) {
    this.variables.push(v);
  }

  addContractInterface(ci) {
    this.contractInterfaces.push(ci);
  }

  print() {
    const init = new Init(this.variables, ['emit ContractInitialized']);
    let code = `
    ${this.imports.map(i => i).join('\n    ')}
    pub contract ${this.contractName}${this.contractInterfaces.length > 0 ? ':' : ''} ${this.contractInterfaces.map(ci => ci).join(', ')} {
      ${this.variables.map(v => v.print()).join('\n')}
      ${Object.values(this.resources).map(r => r.print()).join('\n')}
      ${Object.values(this.functions).map(f => f.print()).join('\n')}

      ${init.print()}
    }
    `

    return code;
  }
}

function addCoreViews(c, nftCollectionData = false, nftCollectionDisplay = false) {
  const resolveViewFunction = new Function('resolveView', 'AnyStruct?', [{ name: '_ view', type: 'Type' }]);
  const getViewsFunction = new Function('getViews', '[Type]');
  
  if (nftCollectionData || nftCollectionDisplay) {
      resolveViewFunction.addCode('switch view {');

      getViewsFunction.addCode('return [')

      if (nftCollectionData) {
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

function addNFT(c) {
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

function addMetadataViews(c, views) {
  const nftResource = c.resources['NFT'];
  nftResource.addInterface('MetadataViews.Resolver')
}

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

function main() {
  addNFT(contract);

  if (options.coreViews.enabled) {
    addCoreViews(contract, options.coreViews.nftCollectionData, options.coreViews.nftCollectionDisplay)
  }

  if (options.metadataViews.length > 0) {
    addMetadataViews(contract, options.metadataViews)
  }

  console.log(contract.print())
}

main();