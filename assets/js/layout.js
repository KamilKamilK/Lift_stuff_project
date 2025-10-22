'use strict';

import $ from 'jquery';
window.jQuery = $;
import 'bootstrap';
import 'babel-polyfill';

$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
});

