"use strict";

var $         = require('jquery');
var _         = require('underscore');
var Backbone  = require('./backbone.js');


var ScrollResults = require('./scrollresults.js');
var QueryResults  = require('./queryresults.js');
const queryText = require('./localization/query').default;
const commonText = require('./localization/common').default;

    function renderHeader(fieldSpec) {
        const field = _.last(fieldSpec.joinPath);
        const icon = field && field.model.getIcon();
        let name = fieldSpec.treeRank || field.getLocalizedName();
        if (fieldSpec.datePart &&  fieldSpec.datePart !== 'fullDate')
            name += ' (' + fieldSpec.datePart + ')';
        return `<div role="columnheader">
            <div class="v-center">
                ${icon
                    ? `<img src="${icon}" alt="" style="width: var(--table-icon-size);">`
                    : ''}
                ${name}
            </div>
        </div>`;
    }

    var QueryResultsTable = Backbone.View.extend({
        __name__: "QueryResultsTable",
        className: "query-results-table",
        initialize: function(options) {
            var opNames = "countOnly noHeader fieldSpecs linkField fetchResults fetchCount initialData ajaxUrl scrollElement format";
            _.each(opNames.split(' '), function(option) { this[option] = options[option]; }, this);
            this.gotDataBefore = false;
        },
        render: function() {
            this.el.innerHTML = `
                ${this.noHeader
                    ? ''
                    : `<h3 class="query-results-count">
                        ${queryText('results')(commonText('loadingInline'))}
                    </h3>`
                }
                ${this.countOnly
                    ? ''
                    : `<div class="grid-table" role="table">
                          <div role="rowgroup">
                              <div role="row">
                                  ${this.fieldSpecs
                                      .map(renderHeader)
                                      .join('')}
                              </div>
                          </div>
                          <div role="rowgroup" class="query-results"></div>
                    </div>`
                }
                <div class="fetching-more" style="display: none;">
                      <img
                          src="/static/img/specify128spinner.gif"
                          alt="${commonText('loading')}"
                      >
                </div>`;
            this.el.setAttribute('aria-live','polite');

            this.fetchCount && this.fetchCount.done(this.setCount.bind(this));

            if (this.countOnly) return this;

            this.results = new ScrollResults({
                el: this.el,
                scrollElement: this.scrollElement,
                view: new QueryResults({model: this.model,
                                        el: this.el,
                                        fieldSpecs: this.fieldSpecs,
                                        format: this.format,
                                        linkField: this.linkField}),
                fetch: this.fetchResults,
                ajaxUrl: this.ajaxUrl,
                initialData: this.initialData
            });
            this.results.render()
                .on('fetching', this.fetchingMore, this)
                .on('gotdata', this.gotData, this)
                .start();

            return this;
        },
        setCount: function(data) {
            this.$('.query-results-count').text(queryText('results')(data.count));
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

module.exports =  QueryResultsTable;

