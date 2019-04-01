var CurrentPage = function () {

    var initNavigationFilter = function ($container) {

        var filterDocumentItems = function (filterText) {
            var $items = $container.find(".faq");

            if (!filterText) {
                $items.show();
                return;
            }

            var $filteredItems = $items.filter(function () {
                return $(this).text().toUpperCase().indexOf(filterText.toUpperCase()) > -1;
            });

            $items.hide();
            $filteredItems.show();
        };

        $("input#FaqFilter").on('input', function (e) {
            filterDocumentItems(e.target.value);
        });
    };

    var expandSelectedFaqItemFromUrlHash = function () {
        if (!window.location) {
            return;
        }

        if (!window.location.hash) {
            return;
        }

        var $el = $("button[data-target='" + window.location.hash + "']");
        $el.click();

        var top = $el.offset().top - 100;

        $('html, body').animate({
            scrollTop: top
        }, 500, 'linear');

    };

    return {
        init: function () {
            initNavigationFilter($("#accordion"));

            expandSelectedFaqItemFromUrlHash();

            $(".faq-container .faq button.btn-link").click(function() {
                window.location.href.substr(0, window.location.href.indexOf('#'));

                window.location.hash = $(this).data("target");

            });
        }
    };
}();