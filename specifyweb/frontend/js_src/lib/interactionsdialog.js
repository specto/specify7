"use strict";

var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('./backbone.js');
var Q        = require('q');


var schema            = require('./schema.js');
var icons             = require('./icons.js');
var specifyform       = require('./specifyform.js');
var initialContext    = require('./initialcontext.js');
var userInfo          = require('./userinfo').default;
var InteractionDialog = require('./interactiondialog.js');
var s                 = require('./stringlocalization.js');
var reports           = require('./reports.js');
const formsText = require('./localization/forms').default;
const commonText = require('./localization/common').default;

    var interaction_entries, views, actions;

    initialContext.load('app.resource?name=InteractionsTaskInit', function (data) {
        interaction_entries = _.map($('entry', data), $)
            .filter(entry => entry.attr('isonleft') === 'true'
                    && !['NEW_DISPOSAL', 'NEW_EXCHANGE_OUT', 'LN_NO_PRP', 'Specify Info Request'].includes(entry.attr('action')));

        views = interaction_entries.filter(entry => !isActionEntry(entry));
        actions = interaction_entries.filter(isActionEntry);

        actions.forEach(actionEntry => actionEntry.table = getTableForObjToCreate(actionEntry));
    });

    function getTableForObjToCreate(action) {
        switch (action.attr('action')) {
        case 'NEW_LOAN':
            return 'loan';
        case 'NEW_GIFT':
            return 'gift';
        default:
            return 'loan';
        }
    }

    function isActionEntry(entry) {
        var actionAttr = entry.attr('action');
        return actionAttr && actionAttr != 'OpenNewView' && actionAttr != 'NEW_ACC';
    }

    function getFormsPromise() {
        return Q.all(views.map(view => Q(specifyform.getView(view.attr('view'))).then(form => form)));
    }

module.exports = Backbone.View.extend({
        __name__: "InteractionsDialog",
        tagName: 'nav',
        className: "interactions-dialog",
        events: {
            'click a.interaction-action': 'interactionActionClick'
        },
        render: function() {
            if(typeof this.options.action === 'undefined'){
                const render = this._render.bind(this);
                getFormsPromise().done(render);
            }
            else {
                const action = interaction_entries
                    .find(a=>a[0].getAttribute('action')==='NEW_LOAN');
                this.handleAction(action);
            }
            return this;
        },
        _render: function(forms) {
            this.forms = forms;
            let formIndex = -1;
            this.el.innerHTML = `<ul style="padding: 0">
                ${interaction_entries
                    .map((entry)=>{
                        if(!isActionEntry(entry))
                          formIndex+=1;
                        return this.dialogEntry(entry, formIndex);
                    })
                    .join('')}
            </ul>`;

            this.$el.dialog({
                title: commonText('interactions'),
                maxHeight: 400,
                modal: true,
                close: function() { $(this).remove(); },
                buttons: [{
                    text: commonText('close'),
                    click: function() { $(this).dialog('close'); }
                }]
            });
            return this;
        },
        getDialogEntryText: function(entry) {
            if (entry.attr('label')) {
                return s.localizeFrom('resources', entry.attr('label'));
            } else if (entry.attr('table')) {
                return schema.getModel(entry.attr('table')).getLocalizedName();
            } else if (isActionEntry(entry)) {
                return entry.attr('action');
            } else {
                return entry.attr('table');
            }
        },
        getDialogEntryTooltip: function(entry) {
            const ttResourceKey = entry.attr('tooltip');
            if (ttResourceKey !== '')
                return s.localizeFrom('resources', ttResourceKey) || '';
            return '';
        },
        dialogEntry: function(interactionEntry, formIndex) {
            let className = 'interaction-action';
            let href='';

            if(isActionEntry(interactionEntry)) {
                const action = interactionEntry[0].getAttribute('action');
                href = `/specify/task/interactions/${action}`;
            }
            else {
              const form = this.forms[formIndex];
              const model = schema.getModel(form['class'].split('.').pop());

              href = new model.Resource().viewUrl();
              className = 'intercept-navigation';
            }

            return `<li
                title="${this.getDialogEntryTooltip(interactionEntry)}"
                aria-label="${this.getDialogEntryTooltip(interactionEntry)}"
            >
                <a
                    class="${className} fake-link"
                    style="font-size: 0.8rem"
                    href="${href}"
                >
                    <img
                        alt="${interactionEntry.attr('icon')}"
                        src="${icons.getIcon(interactionEntry.attr('icon'))}"
                        style="width: var(--table-icon-size)"
                        aria-hidden="true"
                    > 
                    ${this.getDialogEntryText(interactionEntry)}
                </a>
            </li>`;
        },
        isRsAction: function(actionName) {
            return actionName == 'NEW_GIFT' || actionName == 'NEW_LOAN';
        },
        interactionActionClick(event) {
            event.preventDefault();
            const index = this.$('a').filter(".interaction-action").index(event.currentTarget);
            this.$el.dialog('close');
            this.handleAction(actions[index]);
        },
        handleAction(action){
            var isRsAction = this.isRsAction(action.attr('action'));
            if (isRsAction || action.attr('action') == 'RET_LOAN') {
                var tblId = isRsAction ? 1 : 52;
                var recordSets = new schema.models.RecordSet.LazyCollection({
                    filters: { specifyuser: userInfo.id, type: 0, dbtableid: tblId,
                               domainfilter: true, orderby: '-timestampcreated' }
                });
                recordSets.fetch({ limit: 5000 }).done(function() {
                    new InteractionDialog({ recordSets: recordSets, action: action, readOnly: true, close: !isRsAction }).render();
                });
            } else if (action.attr('action') == 'PRINT_INVOICE') {
                //assuming loan invoice for now (52 is loan tableid)
                reports({
                    tblId: 52,
                    //metaDataFilter:  {prop: 'reporttype', val: 'invoice'},
                    autoSelectSingle: true
                });
            } else {
                alert(formsText('actionNotSupported')(action.attr('action')));
            }
        }
    });

