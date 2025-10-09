'use strict';

(function (window, $) {
    window.RepLogApp = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper($wrapper)

            this.$wrapper.find('.js-delete-rep-log').on('click',
                this.handleRepLogDelete.bind(this)
            );

            this.$wrapper.find(' tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
            );
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


            $.ajax({
                url: deleteUrl,
                method: "DELETE",
                success: function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove();
                        RepLogApp.updateTotalWeightLifted();
                    });
                }
            })
        },

        handleRowClick: function (e) {
            console.log('row clicked!');
        },
    };
    /**
     * a "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    Helper.calculateTotalWeight = function () {
        let totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function () {
            totalWeight += $(this).data('weight')
        });

        return totalWeight;
    }
})(window, jQuery);

