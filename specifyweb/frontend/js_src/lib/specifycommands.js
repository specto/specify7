"use strict";

import $ from 'jquery';

import LoanReturnCmd from './loanreturncommand';
import ReportCmd from './reportcommand';
import ShowTransCmd from './showtranscommand';
import UICmd from './uicommand';

import formsText from './localization/forms';

export default {
    ReturnLoan: LoanReturnCmd,
    generateLabelBtn: ReportCmd,
    ShowLoansBtn: ShowTransCmd,
    CommandNotAvailable: UICmd.extend({
        __name__: "UnavailableCommand",
        events: {
            'click': 'click'
        },
        render: function() {
            this.$el.attr('value', formsText('unavailableCommandButton')).prop('disabled', false);
            return this;
        },
        click: function(evt) {
            evt.preventDefault();
            $(`<div>
                ${formsText('unavailableCommandDialogHeader')}
                ${formsText('unavailableCommandDialogMessage')}
            </div>`)
                .append(`<dt>${formsText('commandName')}</dt>`)
                .append($('<dd>').text(this.init.name))
                .dialog({
                    title: formsText('unavailableCommandDialogTitle'),
                    modal: true,
                    close: function() { $(this).remove(); }
                });
        }
    })
};

