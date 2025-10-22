'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css';
import '../styles/pages/dashboard.css';
import '../styles/pages/register.css';
import '@fortawesome/fontawesome-free/css/all.css';


import * as bootstrap from 'bootstrap';

function initBootstrapComponents() {
    document.querySelectorAll('.dropdown-toggle').forEach(el => {
        new bootstrap.Dropdown(el);
    });

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        const placement = el.closest('.nav-item.dropdown') ? 'left' : 'top';
        new bootstrap.Tooltip(el, { placement });
    });
}

initBootstrapComponents();
