import "./mario-cart.scss";

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
