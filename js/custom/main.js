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

function Main()
{
    var that = this;
    this.CartHandler = {};
    this.currentTab = {};

    var loadUI = function (data, element, key) {
        $('a[data-toggle="tab"]').removeClass("active show");
        $("a[data-key=" + that.currentTab.tab + "]").addClass('active show');
        element.html(templateFunctions[key](data));

    };

    var generateCreditCardNumber = function () {
        var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers = "0123456789"
        var cCNumber = "";
        var i;
        for (i = 0; i < 12; i++) {
            cCNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        for (var i = 0; i < 4; i++) {
            var position = Math.floor(Math.random() * cCNumber.length);
            cCNumber = cCNumber.slice(0, position) + alphabets.charAt(
                Math.floor(Math.random() * alphabets.length)
            ) + cCNumber.slice(position)
        }
        return cCNumber.match(/.{1,4}/g);
    }

    var getCartData = function () {
        var cartItems = that.CartHandler.getCartItems();
        var data = {};
        data.subTotal = 0;
        data.discountPercentage = that.currentTab.data.discountPercentage;
        for (var i = cartItems.length - 1; i >= 0; i--) {
            data.subTotal += cartItems[i].price * cartItems[i].quantity
        }
        data.discountTotal = data.subTotal * (data.discountPercentage / 100);
        data.total = data.subTotal - data.discountTotal;
        data.buynowEnabled = that.currentTab.data.buynowEnabled;
        data.discountAudience = that.currentTab.data.discountAudience;
        var cartPageData = {
            cartData: data,
            products: cartItems
        };
        that.currentTab.data.total = data.total;
        return cartPageData;
    };

    this.loadHomePage = function () {
        var data = {
            tabData: that.currentTab.data,
            products: that.CartHandler.productsData
        }
        loadUI(data, $('#content'), that.currentTab.tab)
    };

    this.loadCartItems = function () {
        var cartData = getCartData();
        loadUI(cartData, $('#content'), that.currentTab.tab);
    }

    this.showReceiptModal = function (receiptKey) {
        var cartData = getCartData();
        loadUI(cartData, $('#receiptTemplate'), receiptKey);
        $('#receiptModal').modal('show');
    }
    this.placeOrder = function () {
        that.CartHandler.clearCart();
    }

    this.loadCheckoutPage = function () {
        communicationLayer.sendRequest('checkout', null, function (checkoutResponse) {
            var total = that.currentTab.data.total
            checkoutResponse.currentUser = user.currentUser();
            loadUI(checkoutResponse, $('#content'), that.currentTab.tab);
            $('.paymentTab').removeClass('d-none');
            var cvv = Math.floor(100 + Math.random() * 900);
            var cCNumber = generateCreditCardNumber();
            that.currentTab.data.creditCardData = {
                "total": total.toFixed(2),
                "creditCard": { "cvv": cvv, "number": cCNumber }
            };
            if (checkoutResponse['variationNum'] == 1) {
                loadUI(that.currentTab.data.creditCardData, $('#CreditCardPartial'), Object.keys(templateFunctions)[7]);
            }
        }, eventHandler.failureCallback);
    }
    this.loadCreditCardSection = function () {
        $('#next_btn').hide();
        loadUI(that.currentTab.data.creditCardData, $('#CreditCardPartial'), Object.keys(templateFunctions)[7]);
    };

    this.loadMessagesPage = function () {
        communicationLayer.sendRequest('messagesList', null, function (response) {
            loadUI(response, $('#content'), that.currentTab.tab);
        }, eventHandler.failureCallback);
    };

    this.loadAboutPage = function () {
        loadUI(null, $('#content'), that.currentTab.tab);
    };
    this.displayFlashMessage = function (message) {
        loadUI(message, $('#flashMessage'), Object.keys(templateFunctions)[8]);
        $('#flashMessage').fadeIn('slow', function () {
            $('#flashMessage').delay(2000).fadeOut();
        });
    };

    this.displayProfileSection = function () {
        var currentUser = user.currentUser();
        loadUI(currentUser, $('#profileContent'), Object.keys(templateFunctions)[5]);
    };
};

var templateFunctions = {};

$(document).ready(function () {

    $(document).ajaxStart(function () {
        $("#content").addClass('disable-content');
        $("#loader").css("display", "block");
    });
    $(document).ajaxComplete(function () {
        $("#content").removeClass('disable-content');
        $("#loader").css("display", "none");
    });

    // Compiles associated template functions and appends dynamic tabs
    templateCompiler = new templateCompiler
    templateCompiler.compileTemplates();
    templateFunctions = templateCompiler.templateFunctions;
    $("#demo-tabs").html(templateCompiler.tabElements);
    $('#demo-tabs li:first a').addClass('active');

    var main = new Main();
    window.main = main;
    eventHandler = new eventHandler
    user = new User
    communicationLayer = new communicationLayer
    main.displayProfileSection();

    eventHandler.redirectToHomePage();

    // User login request
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        var email = $("#exampleInputEmail1").val();
        if (eventHandler.validEmail(email)) {
            user.login(email);
            $("#exampleInputEmail1").val(null);
            $('#loginModal').modal('hide');
            main.displayProfileSection();
            eventHandler.redirectToHomePage();
        } else {
            $("#ErrorMessage").html("<div class=\"alert alert-danger\" role=\"alert\">\n invalid email!</div>");
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("data-key"); // activated tab
        main.currentTab.tab = target;
        switch (target) {
            case "home":
                main.loadHomePage();
                break;
            case "cart":
                main.loadCartItems();
                break;
            case "checkout":
                main.loadCheckoutPage();
                break;
            case "messages":
                main.loadMessagesPage();
                break;
            case "about":
                main.loadAboutPage();
                break;
        }
    });

});

