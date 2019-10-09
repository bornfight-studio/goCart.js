import {BaseComponent} from "../../components/BaseComponent";
import {toggleable} from "../toggleable";

describe("toggleable", () => {
    it("should add methods to a class", () => {
        @toggleable()
        class Foo extends BaseComponent {

        }

        const actual = new Foo();
        expect(actual).not.toBe(undefined);
    });
});
