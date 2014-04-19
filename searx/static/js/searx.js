
$(document).ready(function() {
    var isIndexPage = false;
    if (window.location.pathname == '/preferences' || window.location.pathname == '/about') {
        return;
    } else if (window.location.search == '') {
        isIndexPage = true;
    }
    var initialShow = function(){
        $('#search_wrapper').show('slide', {direction: 'left'});
        $('#categories').show('slide', {direction: 'right'});
        $('#searchresults').show('drop', {direction: 'down'});
        $('#q').focus();
    }
    var initAutoCompleter = function() {
        $('#autocomplete-prev').html('&nbsp;');
        $('#autocomplete-current').html('&nbsp;');
        $('#autocomplete-next').html('&nbsp;');

        var autoCompleterCache = [];
        var autoCompleterCachePos = 0;
        var autoCompleterCurrentList = ['#autocomplete-left', '#autocomplete-middle', '#autocomplete-right'];
        var autoCompleterCurrentPos = -1;
        var prevQuery = '';
        var moveSelection = function(by) {
            if (autoCompleterCurrentPos !== -1) {
                $(autoCompleterCurrentList[autoCompleterCurrentPos]).removeClass('autocomplete-current');
                $.removeData(document.body, 'autoComplete');
            }
            if (by === null) {
                autoCompleterCachePos = 0;
                autoCompleterCurrentPos = -1;
                $('#autocomplete-left').html('&nbsp;');
                $('#autocomplete-middle').html('&nbsp;');
                $('#autocomplete-right').html('&nbsp;');
                return;
            } else if (by === 0) {
                autoCompleterCachePos = 0;
                autoCompleterCurrentPos = -1;
            } else if (by === 1) {
                if (autoCompleterCurrentPos !== 2) {
                    autoCompleterCurrentPos++;
                } else if (autoCompleterCachePos < autoCompleterCache.length-3) {
                    autoCompleterCachePos++;
                }
            } else if (by === -1) {
                if (autoCompleterCurrentPos !== 0 && autoCompleterCurrentPos !== -1) {
                    autoCompleterCurrentPos--;
                } else if (autoCompleterCachePos > 0) {
                    autoCompleterCachePos--;
                } else {
                    autoCompleterCurrentPos = -1;
                }
            }
            if (autoCompleterCurrentPos !== -1) {
                $(autoCompleterCurrentList[autoCompleterCurrentPos]).addClass('autocomplete-current');
                $.data(document.body, 'autoComplete', autoCompleterCache[autoCompleterCachePos+autoCompleterCurrentPos]);
            }
            $('#autocomplete-left').html(autoCompleterCache[autoCompleterCachePos]);
            $('#autocomplete-middle').html(autoCompleterCache[autoCompleterCachePos+1]);
            $('#autocomplete-right').html(autoCompleterCache[autoCompleterCachePos+2]);
        }
        $('#q').keyup(function(event){
            if (prevQuery !== event.target.value) {
                if (event.target.value.length >= 3) {
                    $.ajax({url: '/autocompleter', data: {q: event.target.value}, success: function(data){
                        autoCompleterCache = data;
                        prevQuery = event.target.value;
                        moveSelection(0);
                    }.bind(event)});
                } else {
                    moveSelection(null);
                    prevQuery = '';
                }
            }
        })
        $('#q').keydown(function(event){
            if (event.keyCode === 40) {  // down
                event.preventDefault()
                moveSelection(1);
            } else if (event.keyCode === 38) {  // up
                event.preventDefault()
                moveSelection(-1);
            }
        });
    };
    var results_template = '';
    $.ajax({
        url: '/static/js/results.jstemplate',
        success: function(data){
            results_template = Handlebars.compile(data);
        }
    });

    $('#search_form').submit(function(event){
        event.preventDefault();
        // var val = $.data(document.body, 'autoComplete');
        // if (val) {
        //     $('#q').val(val);
        //     return;
        // }
        $('#searchresults').hide('drop', {direction: 'down'});
        var checkboxes = $('.checkbox_container :input[type="checkbox"]');
        var data = {q: $('#q').val(), format: 'json'}
        checkboxes.each(function () {
            if ($(this).is(':checked')) {
                data[this.name] = 'on';
            }
        });
        $.ajax({
            url: '/',
            data: data,
            success: function(data) {
                $('#searchresults').hide(0).html(results_template({results: data.results})).show('drop', {direction: 'down'});
            }
        });
    });
    if (isIndexPage) {
        $('#searxtitle').show({effect: 'fade', complete: initialShow});
        $('#misccontainer').show('drop', {direction: 'up'});
        $('#q').keydown(function(event){
            if (event.keyCode !== 13) {
                return;
            }
            $('#misccontainer').hide('drop', {direction: 'up'});
            $('#categories').hide('slide', {direction: 'right'} );
            $('#search_wrapper').hide('slide', {direction: 'left', complete: function(){
                $('#searxtitle').hide({effect: 'drop', direction: 'up', complete: initialShow});
                $('#q').unbind('keydown');
            }})
        });
    } else {
        initialShow();
    }
});

// if(searx.autocompleter) {
//     window.addEvent('domready', function() {
//         new Autocompleter.Request.JSON('q', '/autocompleter', {
//             postVar:'q',
//             postData:{
//                 'format': 'json'
//             },
//             ajaxOptions:{
//                 timeout: 5   // Correct option?
//             },
//             'minLength': 4,
//             // 'selectMode': 'type-ahead',
//             cache: true,
//             delay: 300
//         });
//     });
// }

// (function (w, d) {
//     'use strict';
//     function addListener(el, type, fn) {
//         if (el.addEventListener) {
//             el.addEventListener(type, fn, false);
//         } else {
//             el.attachEvent('on' + type, fn);
//         }
//     }

//     function placeCursorAtEnd() {
//         if (this.setSelectionRange) {
//             var len = this.value.length * 2;
//             this.setSelectionRange(len, len);
//         }
//     }

//     addListener(w, 'load', function () {
//         var qinput = d.getElementById('q');
//         if (qinput !== null && qinput.value === "") {
//             addListener(qinput, 'focus', placeCursorAtEnd);
//             qinput.focus();
//         }
//     });

// })(window, document);
