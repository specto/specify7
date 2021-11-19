"use strict";

import $ from 'jquery';
import _ from 'underscore';
import Backbone from './backbone';


import template from './templates/queryresults.html';
import ScrollResults from './scrollresults';
import QueryResults from './queryresults';
import queryText from './localization/query';
import commonText from './localization/common';

    function renderHeader(fieldSpec) {
        var field = _.last(fieldSpec.joinPath);
        var icon = field && field.model.getIcon();
        var name = fieldSpec.treeRank || field.getLocalizedName();
        if (fieldSpec.datePart &&  fieldSpec.datePart != 'Full Date') {
            name += ' (' + fieldSpec.datePart + ')';
        }
        var th = $('<th>').text(name);
        icon && th.prepend($('<img>', {src: icon}));
        return th;
    }

    export default Backbone.View.extend({
        __name__: "QueryResultsTable",
        className: "query-results-table",
        initialize: function(options) {
            var opNames = "countOnly noHeader fieldSpecs linkField fetchResults fetchCount initialData ajaxUrl scrollElement format";
            _.each(opNames.split(' '), function(option) { this[option] = options[option]; }, this);
            this.gotDataBefore = false;
        },
        renderHeader: function() {
            var header = $('<tr>');
            _.each(this.fieldSpecs, function(f) { header.append(renderHeader(f)); });
            return $('<thead>').append(header);
        },
        render: function() {
            var inner = $(template({queryText}));
            this.$el.append(inner);
            var table = this.$('table.query-results');
            this.$('.query-results-count').text(commonText('loadingInline'));
            this.countOnly || table.append(this.renderHeader());
            this.noHeader && this.$('h3').remove();
            this.$('.fetching-more').hide();

            this.fetchCount && this.fetchCount.done(this.setCount.bind(this));

            if (this.countOnly) return this;

            var results = this.results = new ScrollResults({
                el: this.el,
                scrollElement: this.scrollElement,
                view: new QueryResults({model: this.model,
                                        el: inner,
                                        fieldSpecs: this.fieldSpecs,
                                        format: this.format,
                                        linkField: this.linkField}),
                fetch: this.fetchResults,
                ajaxUrl: this.ajaxUrl,
                initialData: this.initialData
            });
            results.render()
                .on('fetching', this.fetchingMore, this)
                .on('gotdata', this.gotData, this)
                .start();

            return this;
        },
        setCount: function(data) {
            this.$('.query-results-count').text(data.count);
        },
        remove: function() {
            this.results && this.results.undelegateEvents();
            return Backbone.View.prototype.remove.apply(this, arguments);
        },
        fetchingMore: function() {
            this.$('.fetching-more').show();
        },
        gotData: function() {
            this.$('.fetching-more').hide();
            var el = this.el;
            this.gotDataBefore ||_.defer(function() { el.scrollIntoView(); });
            this.gotDataBefore = true;
        }
    });
