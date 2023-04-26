import { Init } from "./classes.js";

export class ContractBuilder {

  constructor(contractName) {
    this.contractName = contractName;
    this.resources = {};
    this.structs = [];
    this.functions = {};
    this.variables = [];
    this.contractInterfaces = [];
    this.imports = [];
    this.initCode = [];
  }

  addInitCode(initC) {
    this.initCode.push(initC);
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
    const init = new Init(this.variables, this.initCode);
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