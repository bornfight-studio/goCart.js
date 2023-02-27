import "./index.css";

class MarioCart {
    constructor() {
        console.log("Library constructor loaded");
    }

    myMethod = (): boolean => {
        console.log("Library method fired");
        return true;
    };
}

export default MarioCart;
