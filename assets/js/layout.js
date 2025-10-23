'use strict';

import '../styles/main.scss';

import dumbbellImg from '../images/dumbbell.png';
import * as bootstrap from 'bootstrap';

document.querySelectorAll('.dumbbell, .mini-dumbbell').forEach(img => {
    img.src = dumbbellImg;
});

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
