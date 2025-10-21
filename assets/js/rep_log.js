import $ from 'jquery';
import RepLogApp from './Components/RepLogApp';

$(document).ready(function () {
    let $wrapper = $('.js-rep-log-table');

    new RepLogApp($($wrapper));
});
