import { NFTCollectionData, NFTCollectionDisplay } from "./views.js";

export class CoreViews {
  viewOptions
  selectedViews = [];
  imports = ['import ViewResolver from "./ViewResolver.cdc"'];

  constructor(contractName) {
    this.viewOptions = [
      new NFTCollectionData(contractName),
      new NFTCollectionDisplay('Name', 'Description', 'https://ecdao.org')
    ]
  }

  print() {
    return `
    pub fun resolveView(_ view: Type): AnyStruct? {
      switch view {
          ${this.selectedViews.map(view => {
            return `
            case ${view.getViewType()}:
              ${view.getReturn()}
            `
          })}
      }
      return nil
    }

    pub fun getViews(): [Type] {
      return [
        ${this.selectedViews.map(view => view.getViewType())}
      ]
    }
    `
  }

  addView(view) {
    if (!this.selectedViews.includes(view)) {
      this.selectedViews.push(view);
    }
  }
}