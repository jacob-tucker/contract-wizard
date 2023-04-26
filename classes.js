import { AccessModifiers } from "./access-modifiers.js"

export class Resource {

  constructor(name, variables = [], interfaces = [], functions = [], initCode = []) {
    this.name = name
    this.interfaces = interfaces
    this.functions = functions
    this.variables = variables
    this.initCode = initCode
  }

  addInterface(i) {
    this.interfaces.push(i)
  }

  addFunction(f) {
    this.functions.push(f)
  }

  addVariable(v) {
    this.variables.push(v);
  }

  addInitCode(initC) {
    this.initCode.push(initC);
  }

  print() {
    const init = new Init(this.variables, this.initCode)
    return `
    pub resource ${this.name}${this.interfaces.length > 0 ? ':' : ''} ${this.interfaces.map(i => i).join(', ')} {
      ${Object.values(this.variables).map(v => {
        return v.print()
      }).join('\n')}
      ${Object.values(this.functions).map(f => {
        return f.print()
      }).join('\n')}

      ${init.print()}
    }
    `
  }
}

export class Init {
  constructor(variables = [], code = []) {
    this.variables = variables
    this.code = code
  }

  addCode(c) {
    this.code.push(c);
  }

  print() {
    const filterDefaults = this.variables.filter(v => v.defaultValue !== undefined);
    const filterNonDefaults = this.variables.filter(v => v.defaultValue === undefined);
    return `
    init(${filterNonDefaults.map(fnd => fnd.name + ': ' + fnd.type).join(', ')}) {
      ${filterDefaults.map(fd => 'self.' + fd.name + ' = ' + fd.defaultValue).join('\n')}
      ${filterNonDefaults.map(fd => 'self.' + fd.name + ' = ' + fd.name).join('\n')}
      ${this.code.map(line => line).join('\n      ')}
    }
    `
  }
}

export class Variable {

  constructor(name, type, access = AccessModifiers.pub, constant = false, defaultValue = undefined) {
    this.access = access
    this.constant = constant
    this.name = name
    this.type = type
    this.defaultValue = defaultValue
  }

  print() {
    return this.access + ' ' + (this.constant ? 'let' : 'var') + ' ' + this.name + ': ' + this.type;
  }
}

export class Function {

  constructor(name, returnType = undefined, parameters = [], code = []) {
    this.access = AccessModifiers.pub
    this.name = name
    this.returnType = returnType
    this.parameters = parameters
    this.code = code
  }

  addParameter(p) {
    this.parameters.push(p)
  }

  addCode(c) {
    this.code.push(c);
  }

  print() {
    return `
    ${this.access} fun ${this.name}(${this.parameters.map(p => p.name + ': ' + p.type).join(', ')})${this.returnType ? ': ' + this.returnType : ''} {
      ${this.code.map(line => line).join('\n      ')}
    }
    `
  }
}