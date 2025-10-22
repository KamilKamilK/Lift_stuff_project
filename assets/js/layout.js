'use strict';

import * as bootstrap from 'bootstrap';

document.querySelectorAll('.dropdown-toggle').forEach(el => {
    new bootstrap.Dropdown(el);
});
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
});
