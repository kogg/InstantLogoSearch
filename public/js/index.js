$(function() {
    var $window = $(window);
    var $search_bar = $('#search-bar');
    var $body, $filter_style, $header, $sidebar;
    var $header_height;

    $window.on('scroll resize', function(e) {
        $header  = $header  || $('#header');
        $sidebar = $sidebar || $('#sidebar');
        if (!$header_height || e.type === 'resize') {
            $header_height = $header.outerHeight(true);
        }
        $sidebar.toggleClass('sidebar-fixed', $window.scrollTop() > $header_height);
    });

    $search_bar.on('input', function(e) {
        var val = $search_bar.val().toLowerCase().replace(/[^a-z]+/g, '');
        $body = $body || $('body');
        var filtering = !!(val && val.length);
        $body.toggleClass('filtering', filtering);
        $filter_style = $filter_style || $('<style></style>').appendTo('head');
        $filter_style.text(filtering ? ('.trie-' + val + '{display:block !important;}' + '.group-' + val[0] + '{display:block !important;}') : '');
    });
});
