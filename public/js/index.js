$(function() {
    var $window = $(window);
    var $header;
    var $header_height;
    var $sidebar;

    $window.on('scroll resize', function(e) {
        $header  = $header  || $('#header');
        $sidebar = $sidebar || $('#sidebar');
        if (!$header_height || e.type === 'resize') {
            $header_height = $header.outerHeight(true);
        }
        $sidebar.toggleClass('sidebar-fixed', $window.scrollTop() > $header_height);
    });
});
