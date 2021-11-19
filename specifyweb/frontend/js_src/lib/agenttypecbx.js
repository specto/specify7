"use strict";

import $ from 'jquery';
import Backbone from './backbone';


export default Backbone.View.extend({
        __name__: "AgentTypeCBX",
        events: {
            change: 'set'
        },
        initialize: function(info) {
            this.resource = info.resource;
            this.field = info.field.name.toLowerCase();
            if (this.resource.isNew()) {
                this.resource.set(this.field, info.default);
            }
            this.resource.on('change:' + this.field, this.render, this);
        },
        getAgentTypes: function() {
            return ['Organization', 'Person', 'Other', 'Group'];
        },
        render: function() {
            var options = this.getAgentTypes().map(function(type, i) {
                return $('<option>').attr('value', i).text(type)[0];
            });
            this.$el.empty().append(options);
            var initialVal = this.resource.get(this.field);
            this.$el.val(initialVal == null ? 1 : initialVal);
            this.set();
            return this;
        },
        set: function(event) {
            var val = parseInt(this.$el.val(), 10);
            this.resource.set(this.field, val);
        }
    });

