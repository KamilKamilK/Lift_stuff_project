(function() {

    var formEl = document.querySelector('form');
    var selectEl = document.getElementById('rep_item');
    var feedbackEl = document.getElementById('rep_item_feedback');
    if (!formEl || !selectEl || !feedbackEl) return;

    function setInvalidState(isInvalid) {
        if (isInvalid) {
            selectEl.classList.add('is-invalid');
            feedbackEl.classList.remove('d-none');
        } else {
            selectEl.classList.remove('is-invalid');
            feedbackEl.classList.add('d-none');
        }
    }

    selectEl.addEventListener('change', function () {
        setInvalidState(selectEl.value === '');
    });

    formEl.addEventListener('submit', function (e) {
        if (selectEl.value === '') {
            e.preventDefault();
            setInvalidState(true);
            selectEl.focus();
        }
    });
})();


