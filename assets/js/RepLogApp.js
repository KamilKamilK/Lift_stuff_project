'use strict';

(function (window, $) {
    window.RepLogApp = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper($wrapper)

            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            );

            this.$wrapper.on(
                'click',
                ' tbody tr',
                this.handleRowClick.bind(this)
            );

            this.$wrapper.on(
                'submit',
                '.js-new-rep-log-form',
                this.handleNewFormSubmit.bind(this)
            );
            console.log('[RepLogApp] initialized');
        },

        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleRepLogDelete: function (e) {
            e.preventDefault();

            let $link = $(e.currentTarget);

            $link.addClass('text-danger');
            $link.find('.fas')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            let deleteUrl = $link.data('url');
            let $row = $link.closest('tr');
            let self = this;

            $.ajax({
                url: deleteUrl,
                method: "DELETE",
                success: function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove();
                        self.updateTotalWeightLifted();
                    });
                }
            })
        },

        handleRowClick: function (e) {
            console.log('row clicked!');
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            let $form = $(e.currentTarget);
            let $tbody = this.$wrapper.find('tbody')
            let self = this

            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize(),
                success: function (data) {
                    $tbody.append(data);
                    self.updateTotalWeightLifted();

                    $form[0].reset();

                    $form.find('.form-error-message, .is-invalid').removeClass('is-invalid');
                    $form.find('.invalid-feedback, .form-error-message').remove();

                },
                error: function(jqXHR) {
                    $form.closest('.js-new-rep-log-form-wrapper')
                        .html(jqXHR.responseText);
                }
            })
        }
    };
    /**
     * a "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    Helper.prototype.calculateTotalWeight = function () {
        let totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function () {
            totalWeight += $(this).data('weight')
        });

        return totalWeight;
    }
})(window, jQuery);

