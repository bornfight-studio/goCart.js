import MarioCart from "../lib";

const marioCartInstance = new MarioCart();

document.querySelector("body").innerHTML = `<h1>Hello World!</h1>`;

console.log("marioCartInstance", marioCartInstance);

marioCartInstance.myMethod();
