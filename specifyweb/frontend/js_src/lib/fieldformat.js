"use strict";

import _ from 'underscore';
import moment from 'moment';

import dateFormatStr from './dateformat';
import AgentTypeCBX from './agenttypecbx';

    function formatDate(value) {
        if (value == null) return value;
        var m = moment(value);
        return m.isValid() ? m.format(dateFormatStr()) : (value || '');
    }

    function formatInt(value) {
        return value == null ? '' : value;
    }

    var byType = {
        'java.lang.Boolean': function(value) {
            return _.isNull(value) ? '' : (
                value ? 'True' : 'False');
        },
        "java.lang.Integer": formatInt,
        "java.sql.Timestamp": formatDate,
        "java.util.Calendar": formatDate,
        "java.util.Date": formatDate
    };

export default function(field, value) {
        var asInt = parseInt(value, 10);
        if (field.getFormat() === 'CatalogNumberNumeric') {
            return _.isNaN(asInt) ? value : asInt;
        }

        if (field.name === 'agentType' && field.model.name === 'Agent') {
            var agentType = AgentTypeCBX.prototype.getAgentTypes()[asInt];
            return agentType == null ? '' : agentType;
        }

        var bt = byType[field.type];
        if (bt) {
            return bt(value);
        }

        return value == null ? '' :  value;
    };

