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

// Compiles all templates
function templateCompiler()
{
    var that = this;
    this.templateFunctions = {};
    this.tabElements = $();

    var templates = {
        home: {
            title: "Home",
            template_url: "templates/home-content.hbs",
            tab: true
        },
        cart: {
            title: "Cart",
            template_url: "templates/cart-content.hbs",
            tab: true
        },
        checkout: {
            title: "Payment",
            template_url: "templates/checkout-content.hbs",
            tab: true
        },
        messages: {
            title: "Messages",
            template_url: "templates/logs-tab-content.hbs",
            tab: true
        },
        about: {
            title: "About",
            template_url: "templates/about-content.hbs",
            tab: true
        },
        profile: {
            title: "profile",
            template_url: "templates/profile-content.hbs",
            tab: false
        },
        receipt: {
            title: "receipt",
            template_url: "templates/receipt-content.hbs",
            tab: false
        },
        credit_card: {
            title: "Credit Card",
            template_url: "templates/credit-card.hbs",
            tab: false
        },
        flash_message: {
            title: "Flash Message",
            template_url: "templates/flash-message.hbs",
            tab: false
        }
    };

    this.compileTemplates = function () {
        $.each(templates, function (key, value) {
            $.ajax({
                url: value['template_url'],
                success: function (tpl) {
                    that.templateFunctions[key] = Handlebars.compile(tpl);
                },
                async: false
            });
            if (value.tab) {
                var displayClass = ((key === 'checkout') ? 'd-none paymentTab' : '');
                that.tabElements = that.tabElements.add("<li class='nav-item " + displayClass + "' id=tempTab" + key + "><a class='nav-link' data-key=" + key + " data-toggle='tab' href=#" + key + ">" + value['title'] + "</a></li>");
            }
        });
    };
}

// Helpers

(function () {
    function checkCondition(v1, operator, v2)
    {
        switch (operator) {
            case '==':
                return (v1 == v2);
            case '===':
                return (v1 === v2);
            case '!==':
                return (v1 !== v2);
            case '<':
                return (v1 < v2);
            case '<=':
                return (v1 <= v2);
            case '>':
                return (v1 > v2);
            case '>=':
                return (v1 >= v2);
            case '&&':
                return (v1 && v2);
            case '||':
                return (v1 || v2);
            default:
                return false;
        }
    }

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        return checkCondition(v1, operator, v2) ?
            options.fn(this) :
            options.inverse(this);
    });
}());

Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper('amountFixed', function (amount) {
    return amount.toFixed(2);
});

