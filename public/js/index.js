$(function() {
    var $body = $('body');
    var $search_bar = $('#search-bar');
    var searching = '';

    var $filter_style = $('#filter-styles');
    $search_bar.on('input', function(e) {
        searching = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        var filtering = !!(searching && searching.length);
        $body.toggleClass('filtering', filtering);
        $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0] + '{display:block !important;}') : '');
        if (!filtering) {
            $body.removeClass('one-result');
            return;
        }
        var brands = $('.trie-' + searching);
        $body.toggleClass('one-result', brands.length === 1);
        if (brands.length !== 1) {
            return;
        }
        brands.first().trigger('load-content');
    });

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $body.addClass('popup');
        $((searching && searching.length ? '.trie-' + searching : '[data-brand]') + ':first').trigger('load-content');
    });

    $body.on('click', '.tile', function() {
        $body.addClass('popup');
        $(this).parent().trigger('load-content');
    });

    $('#logo-popup').on('click', function(e) {
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

    $body.on('load-content', '[data-brand]', function() {
        console.log('load-content', this, $(this).data());
    });
});
