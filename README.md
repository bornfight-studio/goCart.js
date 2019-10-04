# goCart.js  

A complete Shopify Ajax cart solution written in vanilla JS. This plugin includes Ajax cart drawer,  Ajax mini cart, add to cart modal, and error modal.  
Plugin by [Bornfight](https://www.bornfight.com/) front-end team.
  
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
npm install goCart.js
``` 

### 2. Import goCart.js to your theme JS

```
import CompleteAjaxCart from 'complete-shopify-ajax-cart';
```
  
### 3. Import CSS/SCSS styles  
  
Take the CSS file from `build` folder and include it in your Shopify theme.   

If you are using SCSS you can find the SCSS file inside `src` folder: `src/lib/scss/CompleteAjaxCart.scss`.   
  
You can also simply include it from `node_modules` like this:   
  
```
@import "~complete-shopify-ajax-cart/src/lib/scss/CompleteAjaxCart";
```  
  
### 4. Include `ajax-cart.liquid` file as section  
  
Take the `ajax-cart.liquid` file from `src/lib/` and put it in `sections` folder of your Shopify theme.  

This file contains all elements that make goCart.js   

To make goCart.js elements visible (drawer, modals) you need to include it in your `theme.liquid` file. `theme.liquid` file is the main file  of your theme, so if a section is included inside of it will be visible on all pages. 
  
To do so insert this code: 
```
{%- section 'ajax-cart' -%}
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
 class="js-ajax-add-to-cart" 
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

Take the `ajax-cart-button.liquid` file from `src/lib/` and put it in `snippets` folder of your Shopify theme.  

This file contains goCart elements that make cart button with number of items inside cart.
  
Locate the file that contains your cart button. Usually this will be inside `header.liquid` section.  

Inside your file just include goCart button as a snippet instead your old cart button like this: 

`{% include "ajax-cart-button" %}` 

There is no need to have two cart buttons so you can completely remove your old cart button.
  
### 7. Init the plugin  

```
const ajaxCart = new CompleteAjaxCart();
```
  
## :airplane: Options
```
{
    cartMode: 'drawer', //drawer or mini-cart  
    drawerDirection: 'right', //cart drawer from left or right
    displayModal: false, //display success modal when adding product to cart
}
```
## :globe_with_meridians: Browser Compatibility  
  
goCart.js works in all modern browsers, IE11 and above is supported.  
  
## :white_check_mark: License

MIT License
