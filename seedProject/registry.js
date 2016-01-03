/**
 * Created by parallels on 9/3/15.
 */
"use strict";

var dagon = require('dagon');
var path = require('path');

module.exports = function(_options) {
    var options   = _options || {};
    var container = dagon(options.dagon).container;
    var result;
    try {
        result = container(
                x=> x.pathToRoot(__dirname)
                .for('corelogger').renameTo('logger')
                    .requiredModuleRegistires(['eventstore','readstorerepository','eventdispatcher'])
                    .for('ramda').renameTo('R')
                    .for('ramdafantasy').renameTo('_fantasy')
                    .for('eventstore').require('eventstorePlugin')
                    .for('readstorerepository').require('rsRepositoryPlugin')
                    .for('eventmodels').require('eventModelsPlugin')
                    .for('eventdispatcher').require('eventDispatcherPlugin')
                    .complete(),
                x=>x.instantiate('eventmodels').asFunc()
                .instantiate('eventstore').asFunc().withParameters(options.children || {})
                .instantiate('eventdispatcher').asFunc().withParameters(options.children || {})
                .instantiate('readstorerepository').asFunc().withParameters(options.children || {})
                .instantiate('logger').asFunc().withParameters(options.logger || {})
                .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};