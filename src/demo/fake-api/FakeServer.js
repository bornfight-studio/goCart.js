import {Server, Model} from 'miragejs';
import cartJSON from "./cart.json"

new Server({
    models: {
        cart: Model,
    },
    seeds(server) {
        server.create("cart", cartJSON)
    },
    routes() {
        this.get("/cart.js", (schema) => {
            const cart = schema.carts.first()
            return cart.attrs;
        })
        this.post("/cart/change.js", (schema, request) => {
            const cart = schema.carts.first()
            const body = JSON.parse(request.requestBody);
            const {line, quantity} = body;
            const index = parseInt(line) - 1
            const oldItem = cart.attrs.items[index];
            const newItem = {...oldItem};
            newItem.quantity = quantity;
            newItem.line_price = quantity * newItem.final_price;

            const newItems = [...cart.attrs.items];

            if (newItem.quantity === 0) {
                newItems.splice(index, 1)
            } else {
                newItems.splice(index, 1, newItem)
            }

            const itemCount = newItems.reduce((acc, item) => acc + item.quantity, 0)

            cart.update("items", newItems)
            cart.update("item_count", itemCount)
            return cart.attrs;
        })
    },
})
