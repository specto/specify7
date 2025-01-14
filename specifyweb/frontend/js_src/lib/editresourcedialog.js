"use strict";

var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('./backbone.js');

var schema       = require('./schema.js');
var navigation   = require('./navigation.js');
var populateform = require('./populateform.js');
var SaveButton   = require('./savebutton.js');
var DeleteButton = require('./deletebutton.js');
var specifyform  = require('./specifyform.js');

const commonText = require('./localization/common').default;


module.exports = Backbone.View.extend({
        __name__: "EditResourceDialog",
        className: "resource-edit-dialog",
    initialize: function({resource, deleteWarning}) {
        this.resource = resource;
        this.deleteWarning = deleteWarning;
    },
        render: function() {
            var viewName = this.resource.specifyModel.view || this.resource.specifyModel.name;
            specifyform.buildViewByName(viewName).done(this._render.bind(this));
            return this;
        },
        _render: function(form) {
            form.find('.specify-form-header:first').remove();
            var buttons = $('<div class="specify-form-buttons">').appendTo(form);

            if (!this.readOnly) {
                var saveButton = new SaveButton({ model: this.resource });
                saveButton.render().$el.appendTo(buttons);
                saveButton.on('saving', this.trigger.bind(this, 'saving'));
                saveButton.on('savecomplete', function() {
                    this.close();
                    this.trigger('savecomplete', this, this.resource);
                }, this);
            }

            if (!this.resource.isNew() && !this.readOnly) {
                var deleteButton = new DeleteButton({ model: this.resource, warning: this.deleteWarning });
                deleteButton.render().$el.appendTo(buttons);
                deleteButton.on('deleting', this.close, this);
            }

            populateform(form, this.resource);

            const resourceLabel = this.resource.specifyModel.getLocalizedName();

            this.$el.append(form).dialog({
                width: 'auto',
                title: this.resource.isNew() ?
                    commonText('newResourceTitle')(resourceLabel) :
                    resourceLabel,
                modal: true,
                close: function() { $(this).remove(); }
            });
        },
        close: function() {
            this.$el.dialog('close');
        }
    });

