'use strict';
import Helper from './ReplogAppHelper';
import Swal from "sweetalert2";
import $ from 'jquery';

let HelperInstances = new Map();

class RepLogApp {
    constructor($wrapper) {
        this.$wrapper = $wrapper;
        this.repLogs = new Map();
        HelperInstances.set(this, new Helper(this.repLogs))

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
            RepLogApp._selectors.newRepForm,
            this.handleNewFormSubmit.bind(this)
        );
    }

    static get _selectors() {
        return {
            newRepForm: '.js-new-rep-log-form',
        };
    }

    loadRepLogs() {
        $.ajax({
            url: Routing.generate('rep_log_list'),
        }).then(data => {
            for (let repLog of data.items) {
                this._addRow(repLog);
            }
        });
    }

    updateTotalWeightLifted() {
        this.$wrapper.find('.js-total-weight').html(
            HelperInstances.get(this).getTotalWeightString()
        );
    }

    handleRepLogDelete(e) {
        e.preventDefault();

        const $link = $(e.currentTarget);

        Swal.fire({
            title: 'Delete this log?',
            text: 'What? Did you not actually lift this?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            showLoaderOnConfirm: true,
            preConfirm: () => Promise.resolve(this._deleteRepLog($link)),

            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The log has been removed.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    }

    _deleteRepLog($link) {
        const deleteUrl = $link.data('url');
        const $row = $link.closest('tr');
        const repLogId = $row.data('id');

        $link.addClass('text-danger');
        $link.find('.fa')
            .removeClass('fa-trash')
            .addClass('fa-spinner')
            .addClass('fa-spin');

        return $.ajax({
            url: deleteUrl,
            method: 'DELETE',
        }).then(() => {
            $row.fadeOut('normal', () => {
                this.repLogs.delete(repLogId);

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
        for (let fieldData of $form.serializeArray()) {
            formData[fieldData.name] = fieldData.value
        }

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
        let $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        this._removeFormErrors();

        for (let element of $form.find(':input')) {
            let fieldName = $(element).attr('name');
            let $wrapper = $(element).closest('.form-group');
            if (!errorData[fieldName]) {
                return;
            }

            let $error = $('<span class="js-field-error help-block"></span>');
            $error.html(errorData[fieldName]);
            $wrapper.append($error);
            $wrapper.addClass('has-error')
        }
    }

    _removeFormErrors() {
        let $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form.find('.js-field-error').remove();
        $form.find('.form-group').removeClass('has-error');
    }

    _clearForm() {
        this._removeFormErrors()

        let $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form[0].reset();
    }

    _addRow(repLog) {
        //     // destructuring example
        //     // let {id, itemLabel, reps, totallyMadeUpKey = 'whatever!'} = repLog;
        //     // console.log(id, itemLabel, reps, totallyMadeUpKey);

        // zapisz repLog w Map, kluczem jest jego id
        this.repLogs.set(repLog.id, repLog);

        const html = rowTemplate(repLog);
        const $row = $($.parseHTML(html));

        // zapisujemy id, nie indeks
        $row.data('id', repLog.id);

        this.$wrapper.find('tbody').append($row);
        this.updateTotalWeightLifted();
    }
}

const rowTemplate = (repLog) =>
    ` <tr data-weight="${repLog.totalWeightLifted}">
            <td>${repLog.itemLabel}</td>
            <td>${repLog.reps}</td>
            <td>${repLog.totalWeightLifted}</td>

            <td>
                <a href="#" class="js-delete-rep-log"
                   data-url="${repLog.links._self}">
                    <span class="fas fa-trash"></span>
                </a>
            </td>
        </tr>`

window.RepLogApp = RepLogApp;
export default RepLogApp;
