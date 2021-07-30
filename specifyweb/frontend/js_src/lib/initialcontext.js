"use strict";
import $ from 'jquery';
import Q from 'q';


    var promises = [];
    var final = Q.defer();
    var locked = false;


    export function register(name, promise) {
        if (locked) throw new Error('initial context is locked');
        promises.push(
            promise.tap(() => console.log('initial context:', name))
        );
        return initialContext;
    }

    export function lock() {
        if (locked) throw new Error('initial context already locked');
        locked = true;
        Q.all(promises).done(function() {
            console.log('initial context finished');
            final.resolve();
        });
        return initialContext;
    }

    export function promise() {
        return final.promise;
    }

    function loadHandler(type, file, cb) {
        return register(
            file,
            Q($.get('/' + type + '/' + file))
                .then(cb));
    }

    export const load = loadHandler.bind(null, 'context');
    export const loadProperties = loadHandler.bind(null, 'properties');
    export const loadResource = loadHandler.bind(null, 'static/config');



