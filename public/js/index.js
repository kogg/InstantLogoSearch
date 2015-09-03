$(function() {
    var $body = $('body');
    var $search_bar = $('#search-bar');
    var searching = '';

    var $filter_style;
    $search_bar.on('input', function(e) {
        searching = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        var filtering = !!(searching && searching.length);
        $body.toggleClass('filtering', filtering);
        $body.toggleClass('one-result', filtering && ($('.trie-' + searching).length === 1));
        $filter_style = $filter_style || $('<style></style>').appendTo('head');
        $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0] + '{display:block !important;}') : '');
    });

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $((searching && searching.length ? '.trie-' + searching : '[data-brand]') + ':first .tile').trigger('open-popup');
    });

    $body.on('click', '.tile', function() {
        $(this).trigger('open-popup');
    });

    $('#logo-popup').on('click', function(e) {
        e.stopPropagation();
    });

    $('#logo-popup-container').on('click', function() {
        $body.trigger('close-popup');
    });

    $body.on('keydown', function(e) {
        if (e.which !== 27) {
            return;
        }
        $body.trigger('close-popup');
    });

    $body.on('open-popup', function() {
        $body.addClass('popup');
    });

    $body.on('close-popup', function() {
        $body.removeClass('popup');
    });
});
