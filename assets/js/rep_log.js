import $ from 'jquery';

import * as bootstrap from 'bootstrap/dist/js/bootstrap.esm.js';
window.bootstrap = bootstrap;

import RepLogApp from './Components/RepLogApp';

$(document).ready(function () {
    let $wrapper = $('.js-rep-log-table');

    new RepLogApp($wrapper, $wrapper.data('rep-logs') );

    const popoverTriggerList = document.querySelectorAll('.js-custom-popover');
    popoverTriggerList.forEach(el => {
        new bootstrap.Popover(el, {
            trigger: 'hover',
            placement: 'left'
        });
    });
});
