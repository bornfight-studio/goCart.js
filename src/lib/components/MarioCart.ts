import "./scss/mario-cart.css";

class MarioCart {
    constructor() {
        console.log("MarioCart constructor loaded");
    }

    myMethod = (): boolean => {
        console.log("MarioCart method fired");
        return true;
    };
}

export default MarioCart;
