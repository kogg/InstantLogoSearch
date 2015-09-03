$(function() {
    var $body         = $('body');
    var $filter_style = $('#filter-styles');
    var $popup        = $('#logo-popup');
    var $search_bar   = $('#search-bar');

    var active    = $body.hasClass('one-result') && 'one-result';
    var searching = '';


    $search_bar.on('input', function(e) {
        searching = $search_bar.val().toLowerCase().replace(/[^a-z0-9]+/g, '');
        var filtering = !!searching.length;
        $body.toggleClass('filtering', filtering);
        $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0].replace(/[0-9]/, '0-9') + '{display:block !important;}') : '');
        if (!filtering) {
            $body.trigger('close');
            return;
        }
        var brands = $('.trie-' + searching);
        if (brands.length !== 1) {
            $body.trigger('close');
            return;
        }
        brands.first().trigger('load-content', ['one-result']);
    });
    $search_bar.select();

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $((searching && searching.length ? '.trie-' + searching : '.brand') + ':first').trigger('load-content', ['popup']);
    });

    $body.on('click', '.tile', function() {
        $(this).parent().trigger('load-content', ['popup']);
    });

    $('#logo-popup-container').on('click', function(e) {
        if (active !== 'popup') {
            return;
        }
        var target = $(e.target);
        if ($popup.is(target) || $popup.has(target).length) {
            return;
        }
        $body.trigger('close');
    });

    $body.on('keydown', function(e) {
        if (e.which !== 27) {
            return;
        }
        $body.trigger('close');
    });

    $body.on('load-content', '.brand', function(e, class_name) {
        if (active) {
            return;
        }
        active = class_name;
        $body.addClass(class_name);
        var brand = $(this).data().brand;
        window.history.replaceState('', 'Instant Logo Search - ' + brand.name, '/' + brand.normalized_name);
        document.title = 'Instant Logo Search - ' + brand.name;
    });

    $body.on('close', function() {
        if (!active) {
            return;
        }
        window.history.replaceState('', 'Instant Logo Search', '/');
        document.title = 'Instant Logo Search';
        $body.removeClass(active);
        active = null;
    });
});
