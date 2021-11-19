"use strict";

var navigation         = require('./navigation.js');
var InteractionsDialog = require('./interactionsdialog.js');
const commonText = require('./localization/common').default;


module.exports = {
        task: 'interactions',
        title: commonText('interactions'),
        icon: '/static/img/interactions.png',
        execute: function(action) {
            new InteractionsDialog({action}).render().on('selected', function(model) {
                navigation.go(new model.Resource().viewUrl());
            });
        }
    };

