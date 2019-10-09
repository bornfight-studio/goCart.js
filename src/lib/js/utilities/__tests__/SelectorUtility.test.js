import {SelectorUtility} from "../SelectorUtility";

let selectorUtility;
describe("SelectorUtility", () => {
    beforeEach(() => {
        const prefix = ".js-go-cart-";
        selectorUtility = new SelectorUtility(prefix);
    });

    it("should create correct selector value for a valid argument", () => {
        const actual = selectorUtility.transformValueToCssSelector("modalFail");
        expect(actual).toBe(".js-go-cart-modal-fail");
    });

    it("should throw error for invalid argument", () => {
        expect(() => {
            const actual = selectorUtility.transformValueToCssSelector(3);
        }).toThrow("Invalid name argument: 3, must be of type string.");
    });
});
