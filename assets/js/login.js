'use strict';
import $ from 'jquery';
import '../styles/pages/login.css';

$(document).ready(function () {
    $('.js-login-field-username').on('keydown', function (e) {
        const $usernameInput = $(e.currentTarget);
        $('.login-long-username-warning').remove();

        if ($usernameInput.val().length >= 20) {
            const $warning = $('<div class="login-long-username-warning">This is a really long username - are you sure that is right?</div>');
            $usernameInput.before($warning);
        }
    });
});
