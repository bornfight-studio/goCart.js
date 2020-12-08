import './scss/go-cart.scss';
import {formatMoney} from '@shopify/theme-currency/currency';
import {getSizedImageUrl} from '@shopify/theme-images';
import 'whatwg-fetch';
import serialize from 'form-serialize';
import Handlebars from 'handlebars';

class GoCart {

    constructor(options) {

        const defaults = {
            cartModalFail: '.js-go-cart-modal-fail',
            cartModalFailClose: '.js-go-cart-modal-fail-close',
            cartModal: '.js-go-cart-modal',
            cartModalClose: '.js-go-cart-modal-close',
            cartModalContent: '.js-go-cart-modal-content',
            cartDrawer: '.js-go-cart-drawer',
            cartDrawerContent: '.js-go-cart-drawer-content',
            cartDrawerSubTotal: '.js-go-cart-drawer-subtotal',
            cartDrawerFooter: '.js-go-cart-drawer-footer',
            cartDrawerClose: '.js-go-cart-drawer-close',
            cartMiniCart: '.js-go-cart-mini-cart',
            cartMiniCartContent: '.js-go-cart-mini-cart-content',
            cartMiniCartSubTotal: '.js-go-cart-mini-cart-subtotal',
            cartMiniCartFooter: '.js-go-cart-mini-cart-footer',
            cartTrigger: '.js-go-cart-trigger',
            cartOverlay: '.js-go-cart-overlay',
            cartCount: '.js-go-cart-counter',
            addToCart: '.js-go-cart-add-to-cart',
            removeFromCart: '.js-go-cart-remove-from-cart',
            removeFromCartNoDot: 'js-go-cart-remove-from-cart',
            itemQuantity: '.js-go-cart-quantity',
            itemQuantityPlus: '.js-go-cart-quantity-plus',
            itemQuantityMinus: '.js-go-cart-quantity-minus',
            cartMode: 'drawer',
            drawerDirection: 'right',
            displayModal: false,
            // eslint-disable-next-line no-template-curly-in-string
            moneyFormat: '${{amount}}',
            labelAddedToCart: 'was added to your cart.',
            labelCartIsEmpty: 'Your Cart is currently empty!',
            labelQuantity: 'Quantity:',
            labelRemove: 'Remove',
            imageWidths: [20,100,180,360,540,720,900,1080,1296,1512,1728,1944,2160,2376,2592,2808,3024],
        };

        this.defaults = Object.assign({}, defaults, options);

        this.cartModalFail = document.querySelector(this.defaults.cartModalFail);
        this.cartModalFailClose = document.querySelector(this.defaults.cartModalFailClose);
        this.cartModal = document.querySelector(this.defaults.cartModal);
        this.cartModalClose = document.querySelectorAll(this.defaults.cartModalClose);
        this.cartModalContent = document.querySelector(this.defaults.cartModalContent);
        this.cartDrawer = document.querySelector(this.defaults.cartDrawer);
        this.cartDrawerContent = document.querySelector(this.defaults.cartDrawerContent);
        this.cartDrawerSubTotal = document.querySelector(this.defaults.cartDrawerSubTotal);
        this.cartDrawerFooter = document.querySelector(this.defaults.cartDrawerFooter);
        this.cartDrawerClose = document.querySelector(this.defaults.cartDrawerClose);
        this.cartMiniCart = document.querySelector(this.defaults.cartMiniCart);
        this.cartMiniCartContent = document.querySelector(this.defaults.cartMiniCartContent);
        this.cartMiniCartSubTotal = document.querySelector(this.defaults.cartMiniCartSubTotal);
        this.cartMiniCartFooter = document.querySelector(this.defaults.cartMiniCartFooter);
        this.cartTrigger = document.querySelectorAll(this.defaults.cartTrigger);
        this.cartOverlay = document.querySelector(this.defaults.cartOverlay);
        this.cartCount = document.querySelector(this.defaults.cartCount);
        this.addToCart = document.querySelectorAll(this.defaults.addToCart);
        this.removeFromCart = this.defaults.removeFromCart;
        this.removeFromCartNoDot = this.defaults.removeFromCartNoDot;
        this.itemQuantity = this.defaults.itemQuantity;
        this.itemQuantityPlus = this.defaults.itemQuantityPlus;
        this.itemQuantityMinus = this.defaults.itemQuantityMinus;
        this.cartMode = this.defaults.cartMode;
        this.drawerDirection = this.defaults.drawerDirection;
        this.displayModal = this.defaults.displayModal;
        this.moneyFormat = this.defaults.moneyFormat;
        this.labelAddedToCart = this.defaults.labelAddedToCart;
        this.labelCartIsEmpty = this.defaults.labelCartIsEmpty;
        this.labelQuantity = this.defaults.labelQuantity;
        this.labelRemove = this.defaults.labelRemove;
        this.imageWidths = this.defaults.imageWidths;

        this.init();

    }

    get isDrawerMode() {
        return this.cartMode === 'drawer';
    }

    init() {

        this.fetchCart();

        if (this.isDrawerMode) {
            this.setDrawerDirection();
        }

        document.addEventListener('click', (event) => {
            if (event.target.matches(this.defaults.addToCart)) {
                event.preventDefault();
                let item = event.target;
                let form = item.parentNode;
                while ('form' !== form.tagName.toLowerCase()) {
                    form = form.parentNode;
                }
                const formID = form.getAttribute('id');
                this.addItemToCart(formID);
            }
        }, false);

        this.cartTrigger.forEach((item) => {
            item.addEventListener('click', () => {
                if (this.isDrawerMode) {
                    this.openCartDrawer();
                } else {
                    this.openMiniCart();
                }
                this.openCartOverlay();
            });
        });


        this.cartOverlay.addEventListener('click', () => {
            this.closeFailModal();
            this.closeCartModal();
            if (this.isDrawerMode) {
                this.closeCartDrawer();
            } else {
                this.closeMiniCart();
            }
            this.closeCartOverlay();
        });

        if (this.isDrawerMode) {
            this.cartDrawerClose.addEventListener('click', () => {
                this.closeCartDrawer();
                this.closeCartOverlay();
            });
        }

        if (this.displayModal) {
            this.cartModalClose.forEach((item) => {
                item.addEventListener('click', () => {
                    this.closeFailModal();
                    this.closeCartModal();
                    if (this.isDrawerMode) {
                        this.closeCartDrawer();
                    } else {
                        this.closeMiniCart();
                    }
                    this.closeCartOverlay();
                });
            });
        }

        this.cartModalFailClose.addEventListener('click', () => {
            this.closeFailModal();
            this.closeCartModal();
            if (this.isDrawerMode) {
                this.closeCartDrawer();
            } else {
                this.closeMiniCart();
            }
            this.closeCartOverlay();
        });

    }

    fetchCart(callback) {
        window.fetch('/cart.js', {
            credentials: 'same-origin',
            method: 'GET',
        })
            .then((response) => response.json())
            .then((cart) => this.fetchHandler(cart, callback))
            .catch((error) => {
                this.ajaxRequestFail();
                throw new Error(error);
            });
    }

    addItemToCart(formID) {
        const form = document.querySelector(`#${formID}`);
        const formData = serialize(form, {hash: true});
        window.fetch('/cart/add.js', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((product) => this.addItemToCartHandler(product))
            .catch((error) => {
                this.ajaxRequestFail();
                throw new Error(error);
            });
    }

    removeItem(line) {
        const quantity = 0;
        window.fetch('/cart/change.js', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({quantity, line}),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(() => this.fetchCart())
            .catch((error) => {
                this.ajaxRequestFail();
                throw new Error(error);
            });
    }

    changeItemQuantity(line, quantity) {
        window.fetch('/cart/change.js', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({quantity, line}),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(() => this.fetchCart())
            .catch((error) => {
                this.ajaxRequestFail();
                throw new Error(error);
            });
    }

    cartItemCount(cart) {
        this.cartCount.innerHTML = cart.item_count;
    }

    fetchAndOpenCart() {
        this.fetchCart(() => {
            if (this.isDrawerMode) {
                this.openCartDrawer();
            } else {
                this.openMiniCart();
            }
            this.openCartOverlay();
        });
    }

    fetchAndOpenModal(product) {
        this.fetchCart(() => {
            this.renderCartModal(product);
            this.openCartModal();
            this.openCartOverlay();
        });
    }

    fetchHandler(cart, callback) {
        this.cartItemCount(cart);
        if (this.isDrawerMode) {
            if (cart.item_count === 0) {
                this.renderBlankCartDrawer();
                this.cartDrawerFooter.classList.add('is-invisible');
            } else {
                this.renderDrawerCart(cart);
                this.cartDrawerFooter.classList.remove('is-invisible');
                if ((typeof callback) === 'function') {
                    callback(cart);
                }
            }
        } else if (cart.item_count === 0) {
            this.renderBlankMiniCart();
            this.cartMiniCartFooter.classList.add('is-invisible');
        } else {
            this.renderMiniCart(cart);
            this.cartMiniCartFooter.classList.remove('is-invisible');
            if ((typeof callback) === 'function') {
                callback(cart);
            }
        }
    }

    addItemToCartHandler(product) {
        return this.displayModal ? this.fetchAndOpenModal(product) : this.fetchAndOpenCart();
    }

    ajaxRequestFail() {
        this.openFailModal();
        this.openCartOverlay();
    }

    renderCartModal(product) {
        this.clearCartModal();
        const itemForTemplate   = this.getItemForTemplate(product);
        const template          = Handlebars.compile(this.cartModalContent.getAttribute('data-modal-item'));
        const cartModalProduct  = template(itemForTemplate);
        this.cartModalContent.innerHTML += cartModalProduct;
    }

    renderDrawerCart(cart) {
        this.clearCartDrawer();
        cart.items.forEach((item, index) => {
            const itemForTemplate   = this.getItemForTemplate(item, index);
            const template          = Handlebars.compile(this.cartDrawer.getAttribute('data-drawer-item'));
            const cartSingleProduct = template(itemForTemplate);
            this.cartDrawerContent.innerHTML += cartSingleProduct;
        });
        this.cartDrawerSubTotal.innerHTML = formatMoney(cart.total_price, this.moneyFormat);
        this.cartDrawerSubTotal.parentNode.classList.remove('is-invisible');
        const removeFromCart = document.querySelectorAll(this.removeFromCart);
        removeFromCart.forEach((item) => {
            item.addEventListener('click', () => {
                GoCart.removeItemAnimation(item.parentNode);
                const line = item.parentNode.getAttribute('data-line');
                this.removeItem(line);
            });
        });
        const itemQuantityPlus = document.querySelectorAll(this.itemQuantityPlus);
        itemQuantityPlus.forEach((item) => {
            item.addEventListener('click', () => {
                const line = item.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
                const quantity = Number(item.parentNode.querySelector(this.itemQuantity).value) + 1;
                this.changeItemQuantity(line, quantity);
            });
        });
        const itemQuantityMinus = document.querySelectorAll(this.itemQuantityMinus);
        itemQuantityMinus.forEach((item) => {
            item.addEventListener('click', () => {
                const line = item.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
                const quantity = Number(item.parentNode.querySelector(this.itemQuantity).value) - 1;
                this.changeItemQuantity(line, quantity);
                if (Number((item.parentNode.querySelector(this.itemQuantity).value - 1)) === 0) {
                    GoCart.removeItemAnimation(item.parentNode.parentNode.parentNode.parentNode);
                }
            });
        });
    }

    renderMiniCart(cart) {
        this.clearMiniCart();
        cart.items.forEach((item, index) => {
            const itemForTemplate = this.getItemForTemplate(item, index);
            const template        = Handlebars.compile(this.cartMiniCart.getAttribute('data-mini-item'));
            const cartMiniProduct = template(itemForTemplate);

            this.cartMiniCartContent.innerHTML += cartMiniProduct;
        });
        this.cartMiniCartSubTotal.innerHTML = formatMoney(cart.total_price, this.moneyFormat);
        this.cartMiniCartSubTotal.parentNode.classList.remove('is-invisible');
        const removeFromCart = document.querySelectorAll(this.removeFromCart);
        removeFromCart.forEach((item) => {
            item.addEventListener('click', () => {
                GoCart.removeItemAnimation(item.parentNode);
                const line = item.parentNode.getAttribute('data-line');
                this.removeItem(line);
            });
        });
        const itemQuantityPlus = document.querySelectorAll(this.itemQuantityPlus);
        itemQuantityPlus.forEach((item) => {
            item.addEventListener('click', () => {
                const line = item.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
                const quantity = Number(item.parentNode.querySelector(this.itemQuantity).value) + 1;
                this.changeItemQuantity(line, quantity);
            });
        });
        const itemQuantityMinus = document.querySelectorAll(this.itemQuantityMinus);
        itemQuantityMinus.forEach((item) => {
            item.addEventListener('click', () => {
                const line = item.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
                const quantity = Number(item.parentNode.querySelector(this.itemQuantity).value) - 1;
                this.changeItemQuantity(line, quantity);
                if (Number((item.parentNode.querySelector(this.itemQuantity).value - 1)) === 0) {
                    GoCart.removeItemAnimation(item.parentNode.parentNode.parentNode.parentNode);
                }
            });
        });
    }

    renderBlankCartDrawer() {
        this.cartDrawerSubTotal.parentNode.classList.add('is-invisible');
        this.clearCartDrawer();
        const template        = Handlebars.compile(this.cartDrawer.getAttribute('data-drawer-blank'));
        const blankCartDrawer = template({labelCartIsEmpty: this.labelCartIsEmpty});

        this.cartDrawerContent.innerHTML = blankCartDrawer;
    }

    renderBlankMiniCart() {
        this.cartMiniCartSubTotal.parentNode.classList.add('is-invisible');
        this.clearMiniCart();
        const template      = Handlebars.compile(this.cartMiniCart.getAttribute('data-mini-blank'));
        const blankMiniCart = template({labelCartIsEmpty: this.labelCartIsEmpty});

        this.cartMiniCartContent.innerHTML = blankMiniCart;
    }

    clearCartDrawer() {
        this.cartDrawerContent.innerHTML = '';
    }

    clearMiniCart() {
        this.cartMiniCartContent.innerHTML = '';
    }

    clearCartModal() {
        this.cartModalContent.innerHTML = '';
    }

    openCartDrawer() {
        this.cartDrawer.classList.add('is-open');
    }

    closeCartDrawer() {
        this.cartDrawer.classList.remove('is-open');
    }

    openMiniCart() {
        this.cartMiniCart.classList.add('is-open');
    }

    closeMiniCart() {
        this.cartMiniCart.classList.remove('is-open');
    }

    openFailModal() {
        this.cartModalFail.classList.add('is-open');
    }

    closeFailModal() {
        this.cartModalFail.classList.remove('is-open');
    }

    openCartModal() {
        this.cartModal.classList.add('is-open');
    }

    closeCartModal() {
        this.cartModal.classList.remove('is-open');
    }

    openCartOverlay() {
        this.cartOverlay.classList.add('is-open');
    }

    closeCartOverlay() {
        this.cartOverlay.classList.remove('is-open');
    }

    static removeItemAnimation(item) {
        item.classList.add('is-invisible');
    }

    setDrawerDirection() {
        this.cartDrawer.classList.add(`go-cart__drawer--${this.drawerDirection}`);
    }

    getItemForTemplate(item, index = false) {
        const imageUrl    = item.image;
        let imageWidths   = {};
        this.imageWidths.forEach((item, index) => {
            imageWidths[item] = getSizedImageUrl(imageUrl, item+'x');
        });
        const itemForTemplate = {
            labelAddedToCart: this.labelAddedToCart,
            lineIndex0:       index === 0 || index > 0 ? index : null,
            lineIndex:        index === 0 || index > 0 ? index + 1 : null,
            variantTitle:     item.variant_title ? item.variant_title : null,
            singlePrice:      formatMoney(item.price, this.moneyFormat),
            totalPrice:       formatMoney(item.line_price, this.moneyFormat),
            removeClass:      this.removeFromCartNoDot,
            rImages:          imageWidths,
            rImageSrcAttr:    imageUrl.replace(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i, '_{width}x$&'),
            rImageWidths:     '['+this.imageWidths.join(',')+']',
        };
        return Object.assign(item, itemForTemplate);
    }

}

export default GoCart;
