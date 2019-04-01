var CurrentPage = function () {
    var $container = $("div.container[data-container='checkout']");
    var $submitButton = $container.find("button[name='checkout']");
    var $eulaCheck = $("#eula-check");
    var $eulaValidationError = $(".validation-error.eula-check");
    var $creditTypeRadio = $("input[type=radio][name='creditCardType']");
    var $paymentMethod = $('input[type=radio][name=paymentMethod]');

    var removeUrlParameter = function (url, key) {
        var rtn = url.split("?")[0],
            param,
            paramsArr = [],
            queryString = (url.indexOf("?") !== -1) ? url.split("?")[1] : "";
        if (queryString !== "") {
            paramsArr = queryString.split("&");
            for (var i = paramsArr.length - 1; i >= 0; i -= 1) {
                param = paramsArr[i].split("=")[0];

                if (param === key) {
                    paramsArr.splice(i, 1);
                }
            }

            rtn = rtn + "?" + paramsArr.join("&");
        }
        return rtn;
    };

    var updateQueryStringParameter = function (uri, key, value) {
        if (value === undefined || value == null || value === "") {
            return removeUrlParameter(uri, key);
        }

        var regExp = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(regExp)) {
            return uri.replace(regExp, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    };

    var validateEula = function () {
        if ($eulaCheck.is(":checked")) {
            return true;
        } else {
            $eulaValidationError.show();
            abp.message.warn('You must accept the terms & conditions!');
            return false;
        }
    };

    $creditTypeRadio.change(function () {
        var creditCardType = $(this).val();

        if (creditCardType === "AMEX") {
            document.location.href = updateQueryStringParameter(document.location.href, "creditCardType", "AMEX");
        } else {
            document.location.href = updateQueryStringParameter(document.location.href, "creditCardType", "");
        }
    });

    $eulaCheck.change(function () {
        if (this.checked) {
            $eulaValidationError.hide();
        } else {
            $eulaValidationError.show();
        }
    });

    $paymentMethod.change(function () {
        aspnetzero.updateQueryStringParam("Gateway", this.value);
    });

    var getSelectedGatewayForm = function () {
        return $(".payment-form.selected-form form");
    };

    var getSelectedGatewayName = function () {
        return $(".payment-form.selected-form").data("gateway");
    };

    var validateEmail = function (email) {
        var emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailRegExp.test(email);
    };

    var validatePayU = function () {

        if (!$("#payu-first-name").val()) {
            $("#validation-error-payu-first-name").show();
            return false;
        } else {
            $("#validation-error-payu-first-name").hide();
        }

        if (!$("#payu-last-name").val()) {
            $("#validation-error-payu-last-name").show();
            return false;
        } else {
            $("#validation-error-payu-last-name").hide();
        }
        var valEmail = $("#payu-email-address").val();
        if (!valEmail || !validateEmail(valEmail)) {
            $("#validation-error-payu-email-address").show();
            return false;
        } else {
            $("#validation-error-payu-email-address").hide();
        }


        return true;
    };

    $submitButton.click(function () {
        if (!validateEula()) {
            return;
        }

        var gateway = getSelectedGatewayName();
        var $form = getSelectedGatewayForm();

        if (gateway === "payu") {
            if (!validatePayU()) {
                return;
            }

            $form.submit();
        }
        else if (gateway === "avangate") {
            window.location = $form.attr("action");
        } else {
            abp.message.warn("Selected gateway is unknown: " + gateway + "! Contact to info@aspnetzero.com");
        }
    });

}();