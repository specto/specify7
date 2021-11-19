"use strict";

import Backbone from './backbone';

import saveblockers from './saveblockers';
import ToolTipMgr from './tooltipmgr';


export default Backbone.View.extend({
    __name__: "BasePickListView",
        initialize: function(options) {
            this.infoPromise = this.getItems(options);
        },
        render: function() {
            this.infoPromise.done(this.gotInfo.bind(this));
            return this;
        },
        gotInfo: function(info) {
            this.info = info;
            if (info.resource.isNew()) {
                const defaultItem = info.pickListItems.find(({value, title}) => value === info.default || title === info.default);
                if (defaultItem) {
                    info.resource.set(info.field.name.toLowerCase(), defaultItem.value);
                } else {
                    console.warn("default value for picklist is not a member of the picklist", info);
                }
            }
            if (!info.remote) {
                this.toolTipMgr = new ToolTipMgr(this).enable();
                this.saveblockerEnhancement = new saveblockers.FieldViewEnhancer(this, info.field.name);
            }
            info.field.isRequired && this.$el.addClass('specify-required-field');
            info.resource.on('change:' + info.field.name.toLowerCase(), this.resetValue, this);
            this._render(info);
        }
    });

