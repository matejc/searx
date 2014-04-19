
$(document).ready(function() {
    if (window.location.pathname == '/preferences' || window.location.pathname == '/about') {
        return;
    }
    $('#search_form').hide(0).submit(function(event){
        event.preventDefault();
        $('#searchresults').hide('fade');
        var checkboxes = $('.checkbox_container :input[type="checkbox"]');
        var data = {q: $('#q').val(), format: 'json'}
        checkboxes.each(function () {
            if ($(this).is(':checked')) {
                data[this.name] = 'on';
            }
        });
        for (var i in checkboxes) {
            // if (checkboxes[i].name && checkboxes[i].name.indexOf('category_') == 0) {
            // }
        }
        $.ajax({
            url: '/',
            data: data,
            success: function(data) {
                $('#searchresults').hide(0).show('fade').html(results_template({results: data.results}));
            }
        });
    });
    $('#searxtitle').hide(0).show({effect: 'fade', complete: function(){
        $('#search_form').show('fade');
        $('#q').focus();
    }});
    $('#search_wrapper').hide(0).show('fade');
    $('#misccontainer').hide(0).show('drop', {direction: 'up'});
    $('#q').keydown(function(event){
        if (event.keyCode !== 13) {
            return;
        }
        $('#misccontainer').hide('drop', {direction: 'up'});
        $('#categories').hide('slide', {direction: 'right'} );
        $('#search_wrapper').hide('slide', {direction: 'left', complete: function(){
            $('#searxtitle').hide({effect: 'drop', direction: 'up', complete: function(){
                $('#search_wrapper').show('slide', {direction: 'left'});
                $('#categories').show('slide', {direction: 'right'});
                $('#q').focus();
                $('#q').unbind('keydown');
            }});
        }})
    });
    var results_template = '';
    $.ajax({
        url: '/static/js/results.jstemplate',
        success: function(data){
            results_template = Handlebars.compile(data);
        }
    });
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
