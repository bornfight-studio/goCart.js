export function toggleable(cssClass = "is-opened") {
    return function (target, key) {
        target.open = () => {
            target.domElement.classList.add(cssClass);
        };

        target.close = () => {
            target.domElement.classList.remove(cssClass);
        }
    }
}
