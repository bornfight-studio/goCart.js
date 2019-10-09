import {BaseComponent} from "../BaseComponent";

describe("BaseComponent", () => {
    it("should instantiate the component and save the dom reference", () => {
        document.body.innerHTML =
            '<div>' +
            '  <div class="js-go-cart-test" />' +
            '</div>';

        const actual = new BaseComponent("test");
        expect(actual.domElement).toBeInstanceOf(Element);
    });
});
