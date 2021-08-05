"use strict";

var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('./backbone.js');
var Q        = require('q');


var schema         = require('./schema.js');
var icons          = require('./icons.js');
var specifyform    = require('./specifyform.js');
var initialContext = require('./initialcontext.js');
const commonText = require('./localization/common').default;
const formsText = require('./localization/forms').default;


    // I don't think the non-sidebar items are ever used in Sp6.
    var views;
    initialContext.load(
        'app.resource?name=DataEntryTaskInit',
        data => views = _.map($('view', data), $).filter(view => view.attr('sidebar') === 'true'));

    function getFormsPromise() {
        return Q.all(views.map(
            view => specifyform.getView(view.attr('view')).pipe(form => form)));
    }

module.exports = Backbone.View.extend({
        __name__: "FormsDialog",
        tagName: 'nav',
        className: "forms-dialog",
        events: {'click button': 'selected'},
        render: function() {
            var render = this._render.bind(this);
            getFormsPromise().done(render);
            return this;
        },
        _render: function(forms) {
            this.forms = forms;
            var entries = _.map(views, this.dialogEntry, this);
            $('<ul>').css('padding',0).append(entries).appendTo(this.el);
            this.$el.dialog({
                title: formsText('formsDialogTitle'),
                maxHeight: 400,
                modal: true,
                close: function() { $(this).remove(); },
                buttons: [{
                  text: commonText('cancel'),
                  click: function() { $(this).dialog('close'); }
                }]
            });
            return this;
        },
        dialogEntry: function(view) {
            return $('<li>').append(
                $('<button>')
                    .addClass("fake-link")
                    .css({fontSize: '0.8rem'})
                    .append(
                        $(
                            '<img>',
                            {
                                src: icons.getIcon(view.attr('iconname')),
                                width: 'var(--table-icon-size)',
                                'aria-hidden': true,
                            }
                        ),
                        view.attr('title')
                    )
            )[0];
        },
        selected: function(evt) {
            var index = this.$('button').index(evt.currentTarget);
            this.$el.dialog('close');
            var form = this.forms[index];
            var model = schema.getModel(form['class'].split('.').pop());
            this.trigger('selected', model);
        }
    });

