'use strict';

import $ from 'jquery';
window.jQuery = $;
import 'bootstrap';

$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
});

