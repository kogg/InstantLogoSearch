$(function() {
    var $body = $('body');

    var $window = $(window);
    var $header, $header_height, $sidebar;
    $window.on('scroll resize', function(e) {
        $header  = $header  || $('#header');
        $sidebar = $sidebar || $('#sidebar');
        if (!$header_height || e.type === 'resize') {
            $header_height = $header.outerHeight(true);
        }
        $sidebar.toggleClass('sidebar-fixed', $window.scrollTop() > $header_height);
    });

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        $('.col-3:visible:first .tile').trigger('brand-popup');
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
        $(this).trigger('brand-popup');
    });

    $body.on('brand-popup', '.tile', function(e) {
        console.log('hey', e);
    });
});
