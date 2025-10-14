'use strict';
(function (window, $, Routing, swal) {
    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper(this.$wrapper);

            this.loadRepLogs();

            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            );
            this.$wrapper.on(
                'click',
                'tbody tr',
                this.handleRowClick.bind(this)
            );
            this.$wrapper.on(
                'submit',
                this._selectors.newRepForm,
                this.handleNewFormSubmit.bind(this)
            );
        }

        get _selectors() {
            return {
                newRepForm: '.js-new-rep-log-form',
            };
        }

        loadRepLogs() {
            $.ajax({
                url: Routing.generate('rep_log_list'),
            }).then(data => {
                $.each(data.items, (key, repLog) => {
                    this._addRow(repLog);
                })
            })
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.getTotalWeightString()
            );
        }

        handleRepLogDelete(e) {
            e.preventDefault();

            let $link = $(e.currentTarget);

            swal({
                title: 'Delete this log?',
                text: 'What? Did you not actually lift this?',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: () => this._deleteRepLog($link)

            }).catch(arg => {
                    // console.log('I was canceled', arg)
                }
            )
        }

        _deleteRepLog($link) {
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');
            let deleteUrl = $link.data('url');
            let $row = $link.closest('tr');

            return $.ajax({
                url: deleteUrl,
                method: 'DELETE',
            }).then(() => {
                $row.fadeOut('normal', () => {
                    $row.remove();
                    this.updateTotalWeightLifted();
                });
            });
        }

        handleRowClick() {
            console.log('row clicked!');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();
            let $form = $(e.currentTarget);
            let formData = {};
            $.each($form.serializeArray(), (key, fieldData) => {
                formData[fieldData.name] = fieldData.value
            });

            this._saveRepLog(formData)
                .then(data => {
                    this._clearForm();
                    this._addRow(data);
                }).catch(errorData => {
                this._mapErrorsToForm(errorData.errors);
            });
        }

        _saveRepLog(data) {
            return new Promise((resolve, reject) => {
                const url = Routing.generate('rep_log_new')

                $.ajax({
                    url,
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                }).then((data, textStatus, jqXHR) => {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location')
                    }).then(data => {
                        resolve(data)
                    });
                }).catch(jqXHR => {
                    let errorData = JSON.parse(jqXHR.responseText);
                    reject(errorData);
                })
            });
        }

        _mapErrorsToForm(errorData) {
            let $form = this.$wrapper.find(this._selectors.newRepForm);
            this._removeFormErrors();

            $form.find(':input').each((index, element) => {
                let fieldName = $(element).attr('name');
                let $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    return;
                }

                let $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error')
            })
        }

        _removeFormErrors() {
            let $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        }

        _clearForm() {
            this._removeFormErrors()

            let $form = this.$wrapper.find(this._selectors.newRepForm);
            $form[0].reset();
        }

        _addRow(repLog) {
            let tplText = $('#js-rep-log-row-template').html();
            let tpl = _.template(tplText);

            let html = tpl(repLog);
            this.$wrapper.find('tbody')
                .append($.parseHTML(html));

            this.updateTotalWeightLifted()
        }
    }

    /**
     * A "private" object
     */
    class Helper {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
        }

        calculateTotalWeight() {
            let totalWeight = 0;
            this.$wrapper.find('tbody tr').each((index, element) => {
                totalWeight += $(element).data('weight');
            });
            return totalWeight;
        }

        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();
            if (weight > maxWeight) {
                weight = maxWeight + '+';
            }
            return weight + ' kg'
        }
    }
    window.RepLogApp = RepLogApp;
})(window, jQuery, Routing, swal);
