'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css';
import '../styles/pages/dashboard.css';
import '../styles/pages/register.css';
import '@fortawesome/fontawesome-free/css/all.css';


import * as bootstrap from 'bootstrap';

document.querySelectorAll('.dropdown-toggle').forEach(el => {
    new bootstrap.Dropdown(el);
});
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    if (el.closest('.nav-item.dropdown')) {
        new bootstrap.Tooltip(el, {
            placement: 'left'
        });
    } else {
        new bootstrap.Tooltip(el);
    }
});
