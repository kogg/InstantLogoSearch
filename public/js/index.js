$(function() {
    var $body = $('body');

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $('.col-3:visible:first .tile').trigger('open-popup');
    });

    var $search_bar = $('#search-bar');
    var $filter_style;
    $search_bar.on('input', function(e) {
        var val = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        var filtering = !!(val && val.length);
        $body.toggleClass('filtering', filtering);
        $filter_style = $filter_style || $('<style></style>').appendTo('head');
        $filter_style.text(filtering ? ('.trie-' + val + '{display:block !important;}' + '.group-' + val[0] + '{display:block !important;}') : '');
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
