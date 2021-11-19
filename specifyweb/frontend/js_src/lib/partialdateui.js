"use strict";

import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import UIPlugin from './uiplugin';
import template from './templates/partialdateui.html';
import dateFormatStr from './dateformat';
import ToolTipMgr from './tooltipmgr';
import saveblockers from './saveblockers';
import formsText from './localization/forms';

    var precisions = ['full', 'month-year', 'year'];

export default UIPlugin.extend({
        __name__: "PartialDateUI",
        events: {
            'change select': 'updatePrecision',
            'change input.partialdateui-full': 'updateFullDate',
            'change input.partialdateui-month': 'updateMonth',
            'change input.partialdateui-year': 'updateYear',
            'click a.partialdateui-current-date': 'setToday'
        },
        render: function() {
            var init = this.init;
            var disabled = this.$el.prop('disabled');
            var ui = $(template({formsText}));
            var select = ui.find('select');
            select.prop('id', this.$el.prop('id'));

            if (this.model.isNew() && ("" + this.$el.data('specify-default')).toLowerCase() === 'today')  {
                this.model.set(init.df.toLowerCase(), moment().format('YYYY-MM-DD'));
            }

            this.$el.replaceWith(ui);
            this.setElement(ui);
            ui.find('select, input').prop('readonly', disabled);

            if (disabled) {
                select.hide();
                this.$('.partialdateui-current-date').hide();
            }

            var label = ui.parents().last().find('label[for="' + select.prop('id') + '"]');
            label.text() || label.text(this.model.specifyModel.getField(init.df).getLocalizedName());

            this.$('input.partialdateui-full').attr({
                'size': dateFormatStr().length + 1,
                'placeholder': dateFormatStr()
            });

            this.toolTipMgr = new ToolTipMgr(this).enable();
            this.saveblockerEhancement = new saveblockers.FieldViewEnhancer(this, init.df);

            var setInput = this.setInput.bind(this);
            var setPrecision = this.setPrecision.bind(this);
            this.model.on('change:' + init.df.toLowerCase(), setInput);
            this.model.on('change:' + init.tp.toLowerCase(), setPrecision);

            this.model.fetchIfNotPopulated().done(setInput).done(setPrecision);
            return this;
        },
        setInput: function() {
            var value = this.model.get(this.init.df);
            var m = moment(value);
            this.$('.partialdateui-full').val(value ? m.format(dateFormatStr()) : '');
            this.$('.partialdateui-month').val(value ? m.format('M') : '');
            this.$('.partialdateui-year').val(value ? m.format('YYYY') : '');
        },
        setPrecision: function() {
            var defaultPrec;
            switch(this.init.defaultprecision) {
            case 'year':
                defaultPrec = 3;
                break;
            case 'month':
                defaultPrec = 2;
                break;
            default:
                defaultPrec = 1;
            }
            var precisionIdx = this.model.get(this.init.tp) || defaultPrec;
            _.each(precisions, function(p, i) {
                this.$("td.partialdateui-" + p)[(i + 1 === precisionIdx) ? 'show' : 'hide']();
            }, this);

            this.$('select').val(precisionIdx);
        },
    updatePrecision: function() {
        var precisionIdx = parseInt(this.$('select').val());
        this.model.set(this.init.tp, precisionIdx);
        this.setInput();
        this.model.saveBlockers.remove('invaliddate:' + this.init.df);

        var m = moment(this.model.get(this.init.df));
        switch (precisions[precisionIdx-1]) {
        case 'year':
            m = m.month(0);
        case 'month-year':
            m = m.date(1);
        }
        this.updateIfValid(m);
    },
        updateIfValid: function(m, invalidMessage) {
            if (m == null) {
                this.model.set(this.init.df, null);
                this.model.set(this.init.tp, null); // set precision to null if value is null
                this.setInput();
                this.model.saveBlockers.remove('invaliddate:' + this.init.df);
                console.log('setting date to null');
            } else if (m.isValid()) {
                var value = m.format('YYYY-MM-DD');
                this.model.set(this.init.df, value);
                // precision should be consistent with UI
                this.model.set(this.init.tp, parseInt(this.$('select').val()));
                this.setInput();
                console.log('setting date to', value);
                this.model.saveBlockers.remove('invaliddate:' + this.init.df);
            } else {
                this.model.saveBlockers.add('invaliddate:' + this.init.df, this.init.df,
                                            invalidMessage || formsText('invalidDate'));
            }
        },
        updateFullDate: function() {
            var val = this.$('input.partialdateui-full').val().trim() || null;
            var m = val && moment(val, dateFormatStr(), true);
            this.updateIfValid(m, formsText('requiredFormat')(dateFormatStr()));
        },
        updateMonth: function() {
            var orig = this.model.get(this.init.df);
            var val = parseInt(this.$('input.partialdateui-month').val(), 10);
            var m = (orig ? moment(orig) : moment()).month(val - 1);
            this.updateIfValid(m);
        },
        updateYear: function() {
            var orig = this.model.get(this.init.df);
            var val = parseInt(this.$('input.partialdateui-year:visible').val(), 10);
            var m = (orig ? moment(orig) : moment()).year(val);
            this.updateIfValid(m);
        },
        setToday: function() {
            this.updateIfValid(moment());
        }
    }, { pluginsProvided: ['PartialDateUI'] });

