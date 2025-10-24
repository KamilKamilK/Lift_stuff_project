'use strict';

$(document).ready(function () {
    $('.js-login-field-username').on('keydown', function (e) {
        const $usernameInput = $(e.currentTarget);
        $('.login-long-username-warning').remove();

        if ($usernameInput.val().length >= 20) {
            import("./Components/username_validation_error").then(username_validation_error => {
                username_validation_error.default($(this));
            })
        }
    });
});
