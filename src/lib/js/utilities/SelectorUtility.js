export class SelectorUtility {
    constructor(prefix) {
        this.prefix = prefix;
    }

    getPrefix() {
        return this.prefix;
    }

    transformValueToCssSelector(name) {
        if (typeof name !== "string") {
            throw new Error(`Invalid name argument: ${name}, must be of type string.`)
        }

        const prefix = this.getPrefix();
        const transformed = this.camelCaseToKebabCase(name);
        return prefix.concat(transformed);
    }

    camelCaseToKebabCase(key) {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.split(" ").join("-").toLowerCase();
    }
}
