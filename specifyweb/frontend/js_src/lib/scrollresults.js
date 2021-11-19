"use strict";

import $ from 'jquery';
import _ from 'underscore';
import Backbone from './backbone';
import * as querystring from './querystring';


    var win = $(window);

export default Backbone.View.extend({
        __name__: "ScrollResults",
        events: {
            'remove': 'undelegateEvents'
        },
        initialize: function(options) {
            this.ajaxUrl = options.ajaxUrl;
            this.doFetch = options.fetch || this.doFetchSimple.bind(this);
            this.resultsView = options.view;
            this.offset = 0;
            this.scrollElement = options.scrollElement ?? this.$el;
            this.scroll = this.scroll.bind(this);
        },
        scrolledToBottom: function() {
            return this.scrollElement[0].scrollHeight - this.scrollElement.scrollTop()-10 < this.scrollElement.outerHeight();
        },
        shouldFetchMore: function(ignoreBottom) {
            var criteria = {
                visible: this.$el.is(':visible'),
                atBottom: this.scrolledToBottom(),
                moreToFetch: !this.fetchedAll,
                notCurrentlyFetching: !this.fetch
            };
            console.log('should fetch more', criteria, _.all(criteria));
            return _.all(criteria);
        },
        resultsFromData: function(data) {
            var rv = this.resultsView;
            return rv.resultsFromData ? rv.resultsFromData(data) : data;
        },
        detectEndOfResults: function(results) {
            var rv = this.resultsView;
            return rv.detectEndOfResults ? rv.detectEndOfResults(results) : (results.length < 1);
        },
        fetchMore: function() {
            if (this.fetch) return this.fetch;
            console.log('fetching');
            this.trigger('fetching', this);
            return this.fetch = this.doFetch(this.offset).done(this.gotData.bind(this));
        },
        doFetchSimple: function(offset) {
            var url = querystring.param(this.ajaxUrl, {offset: offset});
            return $.get(url);
        },
        gotData: function(data) {
            var results = this.resultsFromData(data);
            this.fetch = null;
            console.log('gotdata');
            this.trigger('gotdata', this);
            if (this.detectEndOfResults(results)) {
                this.fetchedAll = true;
                this.trigger('fetchedall', this);
            } else {
                this.offset += this.resultsView.addResults(results);
            }
        },
        fetchMoreWhileAppropriate: function() {
            var _this = this;
            function recur() {
                console.log('fetchMoreWhileAppropriate');
                _this.shouldFetchMore() && _this.fetchMore().done(recur);
            }
            recur();
        },
        start: function() {
            var recur = this.fetchMoreWhileAppropriate.bind(this);
            this.fetchMore().done(recur);
        },
        render: function() {
            this.$el.data('view', this);
            this.resultsView.render();
            this.options.initialData && this.gotData(this.options.initialData);
            if (this.options.onWindow) {
                this.onScroll = this.scroll.bind(this);
                win.on('scroll', this.onScroll);
            }
            this.scrollElement[0].addEventListener('scroll', this.scroll);
            return this;
        },
        scroll: function(evt) {
            this.fetchMoreWhileAppropriate();
        },
        undelegateEvents: function() {
            this.onScroll && win.off('scroll', this.onScroll);
            Backbone.View.prototype.undelegateEvents.apply(this, arguments);
        },
        remove: function(){
            this.scrollElement[0].removeEventListener('scroll', this.scroll);
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });

