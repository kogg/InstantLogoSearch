var DOWN = 40;
var ESC  = 27;
var TAB  = 9;
var UP   = 38;

if (document.body.createTextRange) { // ms
    $.fn.highlight = function() {
        var range = document.body.createTextRange();
        range.moveToElementText(this.get(0));
        range.select();
        return this;
    };
} else if (window.getSelection) { // moz, opera, webkit
    $.fn.highlight = function() {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(this.get(0));
        selection.removeAllRanges();
        selection.addRange(range);
        return this;
    };
} else {
    $.fn.highlight = function() {
        return this;
    };
}

$(function() {
    var $body = $('body');
    var $search_bar = $('#search-bar');
    var active = $body.hasClass('one-result') && 'one-result';
    var searching = '';

    /*
     * Tiles
     */
    (function() {
        var $filter_style;

        $search_bar.on('input', function(e) {
            searching = $search_bar.val().toLowerCase().replace(/[^a-z0-9]+/g, '');
            $filter_style = $filter_style || $('#filter-styles');
            var filtering = !!searching.length;
            $body.toggleClass('filtering', filtering);
            $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0].replace(/[0-9]/, '0-9') + '{display:block !important;}') : '');
        })

        $body.on('click', '.tile', function() {
            $(this).parent().trigger('load-content', ['popup']);
        });
    }());

    /*
     * Form
     */
    (function() {
        var $fake_placeholder;
        var filtered_tiles;
        var selection;

        function change_selection(new_selection) {
            if (selection && selection.length) {
                selection.children('.tile').removeClass('selected-tile');
            }
            selection = new_selection;
            $fake_placeholder = $fake_placeholder || $('#fake-placeholder');
            if (selection && selection.length) {
                var brand = selection.data().brand;
                $fake_placeholder.text($search_bar.val() + ((searching.length - brand.normalized_name.length) ? brand.normalized_name.substr(searching.length - brand.normalized_name.length) : ''));
                $fake_placeholder.html($fake_placeholder.text().replace(/ /g, '&nbsp;'));
                selection.children('.tile').addClass('selected-tile');
            } else {
                $fake_placeholder.text('');
            }
        }

        $search_bar.on('input', function(e) {
            filtered_tiles = $('.trie-' + searching);
            change_selection(filtered_tiles.first());
            if (filtered_tiles.length !== 1) {
                $body.trigger('close');
                return;
            }
            selection.trigger('load-content', ['one-result']);
        });

        $search_bar.on('keydown', function(e) {
            var forward;
            switch (e.which) {
                case UP:
                    forward = true;
                    break;
                case DOWN:
                    forward = false;
                    break;
                case TAB:
                    forward = !e.shiftKey;
                    break;
                default:
                    return;
            }
            e.preventDefault();
            if (!selection || !selection.length) {
                return;
            }
            var next_selection;
            if (forward) {
                next_selection = selection.next('.trie-' + searching);
                if ((!next_selection || !next_selection.length) && filtered_tiles && filtered_tiles.length) {
                    next_selection = filtered_tiles.first();
                }
            } else {
                next_selection = selection.prev('.trie-' + searching);
                if ((!next_selection || !next_selection.length) && filtered_tiles && filtered_tiles.length) {
                    next_selection = filtered_tiles.last();
                }
            }
            change_selection(next_selection);
        });

        $('#search-form').on('submit', function(e) {
            e.preventDefault();
            if (!selection || !selection.length) {
                return;
            }
            $search_bar
                .val(selection.data().brand.name)
                .trigger('input');
        });

        $search_bar.select();
    }());

    /*
     * Popup
     */
    (function() {
        var $popup;
        var $popup_container  = $('#logo-popup-container');

        $body.on('load-content', '.brand', function(e, class_name) {
            if (active) {
                return;
            }
            active = class_name;
            $body.addClass(active);
            var brand = $(this).data().brand;
            window.history.replaceState('', 'Instant Logo Search - ' + brand.name, '/' + brand.normalized_name);
            document.title = 'Instant Logo Search - ' + brand.name;

            $popup = $popup || $('#logo-popup');
            $popup.detach();
            $popup.html(swig.run(popup_tmpl, { brand: brand }));
            $popup.appendTo($popup_container);
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

        $popup_container.on('click', function(e) {
            if (active !== 'popup') {
                return;
            }
            var target = $(e.target);
            $popup = $popup || $('#logo-popup');
            if ($popup.is(target) || $popup.has(target).length) {
                return;
            }
            $body.trigger('close');
        });

        $body.on('keydown', function(e) {
            if (active !== 'popup') {
                return;
            }
            if (e.which !== ESC) {
                return;
            }
            $body.trigger('close');
        });

        $body.on('click', '.select-on-click', function() {
            $(this).find('.color').highlight();
        });
    }());

    $('#title-link').on('click', function(e) {
        e.preventDefault();
        $search_bar
            .val('')
            .trigger('input');
    });

    $body.on('mouseenter mouseleave', '.isolate-scrolling', function(e) {
        $body.toggleClass('prevent-scroll', e.type === 'mouseenter');
    });
});
