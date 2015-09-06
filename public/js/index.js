// zip.js
navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
zip.workerScriptsPath = "/zipjs/WebContent/";

var ESC  = 27;
var SPACE = 32;
var TAB  = 9;

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
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
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
            var filtering = !!searching.length;
            $body.toggleClass('filtering', filtering);
            $filter_style = $filter_style || $('#filter-styles');
            $filter_style.text(filtering ? ('.trie-' + searching + '{display:block !important;}' + '.group-' + searching[0].replace(/[0-9]/, '0-9') + '{display:block !important;}') : '');
        })

        $body.on('click', '.tile', function(e) {
            e.preventDefault();
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
            if (e.which !== TAB) {
                return;
            }
            e.preventDefault();
            if (!selection || !selection.length) {
                return;
            }
            var next_selection;
            if (!e.shiftKey) {
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

        var $search_results;
        $('#search-form').on('submit', function(e) {
            e.preventDefault();
            if (!selection || !selection.length) {
                return;
            }
            $search_bar
                .val(selection.data().brand.name)
                .trigger('input')
                .select();
            $search_results = $search_results || $('#search-results');
            $body.scrollTop($search_results.offset().top);
        });

        $body.on('keypress', function(e) {
            if (e.charCode === SPACE) {
                return;
            }
            if ($(e.target).is($search_bar)) {
                return;
            }
            $search_bar.focus();
        });

        $search_bar.on('focusin focusout', function(e) {
            if (!selection || !selection.length) {
                return;
            }
            selection.children('.tile').toggleClass('selected-tile', e.type === 'focusin');
        });

        $search_bar
            .val($search_bar.data('value'))
            .select();

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
            if (e.which !== ESC) {
                return;
            }
            var old_active = active;
            $body.trigger('close');
            if (old_active !== 'popup') {
                $search_bar
                    .val('')
                    .trigger('input');
            }
        });

        $body.on('click', '.select-on-click', function() {
            $(this).find('.color').highlight();
        });
    }());

    /*
     * Collection
     */
    var STORAGE_KEY = 'InstantLogoSearch.collection';
    (function() {
        var $collection;
        var $collection_ctas;
        var $collection_download;
        var collection = [];
        var storage = (window.localStorage || window.sessionStorage);

        $body.on('add-to-collection remove-from-collection', function(e, brand_normalized_name, logo_index, file_index) {
            var brand = $('#brand-' + brand_normalized_name).data().brand;
            var logo  = brand.logos[logo_index];
            var file  = logo.files[file_index];
            var adding = e.type === 'add-to-collection';
            var name_string = [brand_normalized_name, logo_index, file_index].join('-');
            file.in_collection = adding;
            $collection_ctas = $collection_ctas || $('#collection-ctas');
            if (adding) {
                var $collection_file = $('<p class="row collection-file" id="collection-file-' + name_string + '">' +
                                            '<span class="minified">' +
                                                 [brand.name, logo.name, file.name].join(' ') +
                                            '</span>' +
                                            '<span class="delete"></span>' +
                                         '</p>');
                $collection_file.find('.delete').data('filePath', [brand_normalized_name, logo_index, file_index]);
                $collection_ctas.append($collection_file);
                collection.push(file);
            } else {
                var $collection_file = $collection_ctas.find('#collection-file-' + name_string)
                collection.splice($('.collection-file').index($collection_file), 1);
                $collection_file.remove();
            }
            $collection = $collection || $('#collection');
            $collection.css('display', collection.length ? '' : 'none');
            $collection_download = $collection_download || $('#collection-download');
            $collection_download
                .removeClass('loading')
                .removeClass('error')
                .removeClass('success')
                .off('click', zip_and_download);
            switch (collection.length) {
                case 0:
                    $body.removeClass('prevent-scroll');
                    $collection_download.removeAttr('href');
                    break;
                case 1:
                    $collection_download.attr('href', file.url);
                    break;
                default:
                    $collection_download
                        .attr('href', '/collection?' + collection.map(function(file) {
                            return 'ids[]=' + file.id;
                        }).join('&'))
                        .one('click', zip_and_download);
                    break;
            }
            var $file = $('#file-' + name_string);
            if ($file.length) {
                $file
                    .toggleClass('save', !adding)
                    .toggleClass('check', adding);
            }
            file.storage_key = file.storage_key || [brand.normalized_name, logo.name, file.name];
            storage.setItem(STORAGE_KEY, JSON.stringify((collection || []).map(function(file) {
                return file.storage_key;
            })));
        });

        function zip_and_download(e) {
            var $this = $(this);
            e.preventDefault();
            $this
                .addClass('loading')
                .removeClass('error')
                .removeClass('success');
            zip.createWriter(new zip.BlobWriter(),
                function(writer) {
                    var current_collection = collection.slice(0);
                    var collection_length = current_collection.length;
                    addFile(0);
                    function addFile(i) {
                        var file = current_collection[i];
                        writer.add(file.url.substring(file.url.lastIndexOf('/') + 1), new zip.HttpReader(file.url), function() {
                            if (i + 1 !== collection_length) {
                                return addFile(i + 1);
                            }
                            writer.close(function(blob) {
                                if (typeof window.saveAs == "function") {
                                    window.saveAs(blob, $this.attr('download'));
                                } else if (typeof navigator.saveBlob == "function") {
                                    navigator.saveBlob(blob, $this.attr('download'));
                                } else {
                                    $this.attr('href', URL.createObjectURL(blob))
                                    $this[0].click();
                                }
                                $this
                                    .removeClass('loading')
                                    .removeClass('error')
                                    .addClass('success');
                            });
                        });
                    }
                },
                function() {
                    $this
                        .removeClass('loading')
                        .addClass('error')
                        .removeClass('success');
                });
        }

        (JSON.parse(storage.getItem(STORAGE_KEY) || '[]') || []).forEach(function(file_storage_key) {
            var brand = $('#brand-' + file_storage_key[0]).data().brand;
            if (!brand) {
                return;
            }
            var logo_index = (brand.logos || []).findIndex(function(logo) {
                return logo.name === file_storage_key[1];
            });
            if (logo_index === -1) {
                return;
            }
            var logo = brand.logos[logo_index];
            var file_index = (logo.files || []).findIndex(function(file) {
                return file.name === file_storage_key[2];
            });
            if (file_index === -1) {
                return;
            }
            var file = logo.files[file_index];
            file.storage_key = file.storage_key || file_storage_key;
            $body.trigger('add-to-collection', [brand.normalized_name, logo_index, file_index]);
        });

        $body.on('click', '.save', function() {
            $body.trigger('add-to-collection', $(this).data('filePath'));
        });

        $body.on('click', '.check,.delete', function() {
            $body.trigger('remove-from-collection', $(this).data('filePath'));
        });

        $('#clear-collection').on('click', function() {
            $('.delete').click();
        });

        $body.on('mouseenter mouseleave', '.isolate-scrolling', function(e) {
            $body.toggleClass('prevent-scroll', e.type === 'mouseenter');
        });
    }());

    $('#title-link').on('click', function(e) {
        e.preventDefault();
        $search_bar
            .val('')
            .trigger('input');
    });
});
