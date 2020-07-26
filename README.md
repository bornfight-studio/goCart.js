<p align="center">
  <img width="300" src="https://user-images.githubusercontent.com/11228203/67099323-0450df80-f1be-11e9-962a-e74fe958a337.png"/>
</p>

___

[![npm version](https://badge.fury.io/js/%40bornfight%2Fgocart.svg)](https://badge.fury.io/js/%40bornfight%2Fgocart)
![GitHub last commit](https://img.shields.io/github/last-commit/bornfight/gocart.js)
![npm](https://img.shields.io/npm/dm/@bornfight/gocart)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/bornfight/goCart.js/issues)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# goCart.js  

A complete Shopify Ajax cart solution written in vanilla JS. This plugin includes Ajax cart drawer,  Ajax mini cart, add to cart modal, and error modal.  
Plugin by [Bornfight](https://www.bornfight.com/) front-end team.

## :video_game:  Demo

- All products

[https://ajax-cart-plugin-npm-test.myshopify.com/collections/all/](https://ajax-cart-plugin-npm-test.myshopify.com/collections/all/)

- Product with one variant

[https://ajax-cart-plugin-npm-test.myshopify.com/products/classic-leather-jacket](https://ajax-cart-plugin-npm-test.myshopify.com/products/classic-leather-jacket)

- Product with multiple variants

[https://ajax-cart-plugin-npm-test.myshopify.com/products/classic-varsity-top](https://ajax-cart-plugin-npm-test.myshopify.com/products/classic-varsity-top)

  
## :muscle: Features

- Cart drawer (with left or right direction)
- Mini cart (cart flying under cart button)
- Success modal when product was added to cart with CTA buttons to continue shopping (optional)
- Error modal (when Ajax request fails)
- Control of products inside opened cart (remove, add or subtract quantity)  
- See all product information inside opened cart (image, title, variant)
- Written in vanilla JS (no Jquery needed) 
- Barebones (only minimal styles are included) 

## :hammer: Getting Started  
  
Compiled code can be found in the `build` directory. The `src` directory contains development code.  
  
### 1. Install plugin  
  
```
npm i @bornfight/gocart
``` 

### 2. Import goCart.js to your theme JS

```
import GoCart from '@bornfight/gocart';
```

Or if you are not using any module bundler you can import goCart.js manually. Add `index.js` file from `build` folder (you can also rename it) to your theme `assets` folder.

Then just include the goCart.js inside `theme.liquid` file, best right before closing of `</body>` tag.

```
{{ 'gocart.js' | asset_url | script_tag }}
```
  
### 3. Import CSS/SCSS styles  
  
Take the CSS file from `build` folder and include it in your Shopify theme.   

If you are using SCSS you can find the SCSS file inside `src` folder: `src/lib/scss/go-cart.scss`.   
  
You can also simply include it from `node_modules` like this:   
  
```
@import "~@bornfight/gocart/src/lib/scss/go-cart";
```  
  
### 4. Include `go-cart.liquid` file as section  
  
Take the `go-cart.liquid` file from `src/lib/` and put it in `sections` folder of your Shopify theme.  

This file contains all elements that make goCart.js   

To make goCart.js elements visible (drawer, modals) you need to include it in your `theme.liquid` file. `theme.liquid` file is the main file  of your theme, so if a section is included inside of it will be visible on all pages. 
  
To do so insert this code: 
```
{%- section 'go-cart' -%}
``` 
inside `theme.liquid` file, best right before closing of `</body>` tag.  
  
### 5. Edit product.liquid section  
  
Inside your product template (if you use section inside product template then open product section) find the form to add product to cart.  
   
This will probably look similar to this:   
  
```  
<form action="/cart/add" method="post" enctype="multipart/form-data">......  
```  
  
You will need to add identifier to that form which goCart.js uses to add products to cart. Replace this code with this (just adding the ID):  
  
```  
<form action="/cart/add" method="post" enctype="multipart/form-data"  
  id="add-to-cart-{{ product.handle }}-{{ collection.handle }}-{{ section.id }}">
 ```  
  
Inside that same form, find 'Add to cart' button, which user presses when he wants to add product to cart.   
  
This will probably look similar to this:
  
```  
<button  
 type="submit" 
 name="add" 
 data-add-to-cart 
 {%- unless current_variant.available -%}disabled="disabled" {%- endunless -%}> 
	 <span data-add-to-cart-text> 
	    {%- if current_variant.available -%} 
                {{- 'products.product.add_to_cart' | t -}} 
	    {%- else -%} 
                {{- 'products.product.sold_out' | t -}} 
	    {%- endif -%} 
	 </span>
</button>  
```  
  
You will need to add class to that button that goCart.js uses to prevent standard behavior and to add to cart with  Ajax (just adding the class).  
  
```  
<button  
 type="submit" 
 name="add" 
 data-add-to-cart 
 class="js-go-cart-add-to-cart"
 {%- unless current_variant.available -%}disabled="disabled"{%- endunless -%}> 
	 <span data-add-to-cart-text> 
	    {%- if current_variant.available -%} 
	        {{- 'products.product.add_to_cart' | t -}} 
	    {%- else -%} 
	        {{- 'products.product.sold_out' | t -}} 
	    {%- endif -%} 
	 </span>
 </button>  
```  
  
### 6. Replace your cart button with goCart button

Take the `go-cart-button.liquid` file from `src/lib/` and put it in `snippets` folder of your Shopify theme.  

This file contains goCart elements that make cart button with number of items inside cart.
  
Locate the file that contains your cart button. Usually this will be inside `header.liquid` section.  

Inside your file just include goCart button as a snippet instead your old cart button like this: 

`{%- include "go-cart-button" -%}` 

There is no need to have two cart buttons so you can completely remove your old cart button.
  
### 7. Init the plugin  

```
const goCart = new GoCart();
```

or for manual installations, init inside `theme.liquid` file, right after including the goCart.js script from assets.

```
<script>
  var goCart = new GoCart();
</script>
```

You should have something like this:

```
{{ 'gocart.js' | asset_url | script_tag }}

<script>
  var goCart = new GoCart();
</script>
```
  
## :airplane: Options
```
{
    cartMode: 'drawer', //drawer or mini-cart  
    drawerDirection: 'right', //cart drawer from left or right
    displayModal: false, //display success modal when adding product to cart
    moneyFormat: '${{amount}}', //template for money format when displaying money
}
```

## :moneybag: Currency options

Price is converted to money with Shopify's `theme-currency` script. You can check it out here:

[https://github.com/Shopify/theme-scripts/blob/master/packages/theme-currency/README.md](https://github.com/Shopify/theme-scripts/blob/master/packages/theme-currency/README.md) 

Default currency is Dollar ($). If your shop uses different currency you can change the output of money inside goCart.js with `moneyFormat` option.

Options accepts template for Shopify's `theme-currency` script. 

```
{
    moneyFormat: '${{amount}}'
}
```

This will print `$50.00`.

Changing the template you can change how your money is displayed, so: 

```
{
    moneyFormat: '€{{amount}}'
}
```

will print `€50.00`, and 

```
{
    moneyFormat: '{{amount}} HRK'
}
```

will print `50.00 HRK`.

## :question: Drawer and mini cart modes

goCart.js has two cart modes - drawer and mini cart. Drawer is mode where cart comes from left or right outside of the visible viewport. Mini cart mode flies under the cart button (cart icon) in header. Both are very popular these days and you can change the cart layout with goCart.js within seconds. If you are using Drawer mode and you are keen on performance, you can even remove the mini cart liquid code from `go-cart-button.liquid`. Liquid code for the mini cart mode is between the mini cart commented code inside that file: 

```
<!--go cart mini cart-->
...
<!--end go cart mini cart-->
```

Or if you are using only mini cart and you are keen on performance you can remove the cart drawer liquid code from `go-cart.liquid`. Liquid code for the cart drawer mode is between the cart drawer commented code inside that file: 

```
<!--go cart drawer-->
...
<!--end go cart drawer-->
```

## :globe_with_meridians: Browser Compatibility  
  
goCart.js works in all modern browsers, IE11 and above is supported.  
  
## :white_check_mark: License

MIT License
