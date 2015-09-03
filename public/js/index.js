var POPUP      = 1;
var ONE_RESULT = 2;

$(function() {
    var $body         = $('body');
    var $filter_style = $('#filter-styles');
    var $popup        = $('#logo-popup');
    var $search_bar   = $('#search-bar');
    var searching = '';

    $search_bar.on('input', function(e) {
        searching = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        var filtering = !!searching.length;
        $body.toggleClass('filtering', filtering);
        $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0] + '{display:block !important;}') : '');
        if (!filtering) {
            $body.removeClass('one-result');
            return;
        }
        var brands = $('.trie-' + searching);
        var one_result = brands.length === 1;
        $body.toggleClass('one-result', one_result);
        if (!one_result) {
            return;
        }
        brands.first().trigger('load-content');
    });

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $body.addClass('popup');
        $((searching && searching.length ? '.trie-' + searching : '.brand') + ':first').trigger('load-content');
    });

    $body.on('click', '.tile', function() {
        $body.addClass('popup');
        $(this).parent().trigger('load-content');
    });

    $popup.on('click', function(e) {
        e.stopPropagation();
    });

    $('#logo-popup-container').on('click', function() {
        $body.removeClass('popup');
    });

    $body.on('keydown', function(e) {
        if (e.which !== 27) {
            return;
        }
        $body.removeClass('popup');
    });

    $body.on('load-content', '.brand', function() {
        console.log('load-content', this, $(this).data());
    });
});
