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

function eventHandler()
{

    var that = this;

    this.failureCallback = function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Error: ' + errorThrown);
    }

    this.validEmail = function (email) {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    };

    this.redirectToHomePage = function () {
        communicationLayer.sendRequest('activate', null, function (response) {
            var myProducts = response.products;
            var home_page_data = response;
            delete home_page_data['products'];
            home_page_data.discount = (response.discountPercentage / 100);
            main.CartHandler = new CartHandler(myProducts);
            main.currentTab = {
                tab: Object.keys(templateFunctions)[0],
                data: home_page_data
            }
            main.loadHomePage();
        }, that.failureCallback);
    };

    this.addToCart = function (product_id, qty, fromShopPage) {
        params = { trackEvent: 1, revenue: 0 };
        communicationLayer.sendRequest('track', params, function (response) {
            if (response) {
                var cartHandler = main.CartHandler
                cartHandler.addItem(product_id, qty);
                var message = { "message": "Product added to cart!" };
                main.displayFlashMessage(message);
            }
        }, that.failureCallback);
    };

    this.updateCart = function (product_id) {
        var setQty = parseInt($("#pr-qty_" + product_id).val());
        var actualQty = parseInt($("#pr-qty_" + product_id).attr("actual_qty"));
        if (setQty < 1 || setQty > 99) {
            $("#pr-qty_" + product_id).val(actualQty);
            alert('Invalid Quantity! must be between 1 to 99');
            return false;
        }
        var updateQty = Math.abs(setQty - actualQty);
        var cartHandler = main.CartHandler
        setQty > actualQty ? cartHandler.addItem(product_id, updateQty) : cartHandler.removeItem(product_id, updateQty)
        main.loadCartItems();
    };

    this.removeProduct = function (product_id, qty) {
        var cartHandler = main.CartHandler
        cartHandler.removeItem(product_id, qty);
        main.loadCartItems();
    }

    this.clearCart = function () {
        if (confirm("Do you want to remove all items?")) {
            var cartHandler = main.CartHandler
            cartHandler.clearCart();
            main.CartHandler = new CartHandler(cartHandler.productsData)
            main.loadCartItems();
        }
    };

    this.showReceipt = function () {
        $('#receiptModalLongTitle').html("Receipt: " + Math.floor(100000 + Math.random() * 900000))
        var receiptKey = Object.keys(templateFunctions)[6]
        main.showReceiptModal(receiptKey);
    };

    this.placeOrder = function (trackEvent) {
        var total = parseInt(main.currentTab.data.total * 100);
        params = { trackEvent: trackEvent, revenue: total };
        communicationLayer.sendRequest('track', params, function (response) {
            if (response) {
                main.placeOrder();
                main.currentTab.tab = Object.keys(templateFunctions)[0];
                var cartHandler = main.CartHandler
                main.CartHandler = new CartHandler(cartHandler.productsData)
                main.loadHomePage();
                var message = { "message": "Thank you for shopping" };
                main.displayFlashMessage(message)
                $('.paymentTab').addClass('d-none');
                $('#receiptTemplate').html("");
                $('#receiptModal').modal('hide');
            }
        }, that.failureCallback);
    };

    this.loadPaymentPage = function () {
        main.currentTab.tab = Object.keys(templateFunctions)[2];
        main.loadCheckoutPage();
    };

    // User logout request
    this.logoutSession = function () {
        localStorage.clear();
        window.location.reload();
    };

    this.clearMessages = function () {
        if (confirm("Click OK to continue?")) {
            communicationLayer.sendRequest('clearMessages', null, function (response) {
                main.loadMessagesPage();
            }, that.failureCallback);
        }
    };

    this.showCreditCardSection = function () {
        main.loadCreditCardSection();
    }
};

