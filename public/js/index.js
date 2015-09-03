$(function() {
    var $body         = $('body');
    var $filter_style = $('#filter-styles');
    var $popup        = $('#logo-popup');
    var $search_bar   = $('#search-bar');
    var searching = '';

    $search_bar.on('input', function(e) {
        $body.trigger('close');
        searching = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        var filtering = !!searching.length;
        $body.toggleClass('filtering', filtering);
        $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0] + '{display:block !important;}') : '');
        if (!filtering) {
            return;
        }
        var brands = $('.trie-' + searching);
        if (brands.length !== 1) {
            return;
        }
        brands.first().trigger('load-content', ['one-result']);
    });

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $((searching && searching.length ? '.trie-' + searching : '.brand') + ':first').trigger('load-content', ['popup']);
    });

    $body.on('click', '.tile', function() {
        $(this).parent().trigger('load-content', ['popup']);
    });

    $popup.on('click', function(e) {
        e.stopPropagation();
    });

    $('#logo-popup-container').on('click', function() {
        $body.trigger('close');
    });

    $body.on('keydown', function(e) {
        if (e.which !== 27) {
            return;
        }
        $body.trigger('close');
    });

    var active = null;
    var loaded_brand;

    $body.on('load-content', '.brand', function(e, class_name) {
        if (active) {
            return;
        }
        active = class_name;
        $body.addClass(class_name);
        console.log('load-content', this, $(this).data());
    });

    $body.on('close', function() {
        if (!active) {
            return;
        }
        $body.removeClass(active);
        active = null;
    });
});
