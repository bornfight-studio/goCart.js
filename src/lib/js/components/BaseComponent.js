import {SelectorUtility} from "../utilities/SelectorUtility";

const selectorUtility = new SelectorUtility(".js-go-cart-");
export class BaseComponent {
    constructor(componentName) {
        this.selector = selectorUtility.transformValueToCssSelector(componentName);
        this.init();
    }

    init() {
        this.initDomElement();
    }

    destroy() {
        this.domElement = null;
    }

    initDomElement() {
        this.domElement = document.querySelector(this.selector);
    }

    on(handler) {
        this.domElement.addEventListener(handler, () => {

        });
    }
}
