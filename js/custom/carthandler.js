// Copyright 2018, Optimizely
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function CartHandler(productsData)
{

    var that = this;

    this.productsData = productsData;
    this.cartData = new Object();

    var dataStorageKey = "cartItems";

    //private methods
    var addOrRemove = function (productId, noOfItems, isAdd) {
        var cartItems = that.getAllItems();
        noofItems = noOfItems > 0 ? noOfItems : 1;

        if (cartItems[productId] != undefined) {
            if (isAdd) {
                cartItems[productId].quantity += noOfItems;
            } else {
                cartItems[productId].quantity -= noOfItems;
            }

            that.save(cartItems);
        }

    };

    // by default 1
    this.addItem = function (productId, noOfItems) {
        addOrRemove(productId, noOfItems, true);
    }
    this.removeItem = function (productId, noOfItems) {
        addOrRemove(productId, noOfItems, false);
    };

    this.clearCart = function () {
        var cartItems = new Array();
        that.save(cartItems);
    };

    this.save = function (data) {
        localStorage.setItem(dataStorageKey, JSON.stringify(data));
    };

    this.getCartItems = function () {

        var allItems = that.getAllItems();
        var allItemsKeys = Object.keys(allItems);
        var cartItems = new Array();

        for (var i = 0; i < allItemsKeys.length; i++) {
            var cartItem = allItems[allItemsKeys[i]];
            if (cartItem.quantity > 0) {
                cartItems.push(allItems[allItemsKeys[i]]);
            }
        }
        return cartItems;
    };

    this.getAllItems = function () {
        var cartItems = localStorage.getItem(dataStorageKey);
        return JSON.parse(cartItems);
    };

    // constructor
    (function initializeData()
    {
        var cartItems = that.getAllItems();
        for (var i = 0; i < that.productsData.length; i++) {
            var clonedCopy = $.extend({}, productsData[i]);
            that.cartData[productsData[i].id] = clonedCopy;
            clonedCopy.quantity = (cartItems == null || (cartItems.length == 0)) ? 0 : cartItems[productsData[i].id].quantity;
        }
        that.save(that.cartData);
    })();
}

