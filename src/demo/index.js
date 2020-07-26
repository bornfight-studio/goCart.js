import GoCart from '../lib/GoCart';
import "./fake-api/FakeServer"


class DemoApp {
    constructor() {
        new GoCart({})
        console.log("demo app init");
    }
}

new DemoApp();
