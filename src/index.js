/**
 * Created by reharik on 1/7/16.
 */
var config = require('config');
var extend = require('extend');
var fs = require('fs');
var registry = require('./../registry');
var Promise = require('bluebird');


var setupBootstrap = function(state) {
    var auth      = {
        username: state.eventstore.gesClientHelpers.systemUsers.admin,
        password: state.eventstore.gesClientHelpers.systemUsers.defaultAdminPassword
    };
    var metadata  = state.eventstore.gesClientHelpers.createStreamMetadata({
        acl: {
            readRoles: state.eventstore.gesClientHelpers.systemRoles.all
        }
    });
    state.setData = {
        expectedMetastreamVersion: -1,
        metadata                 : metadata,
        auth                     : auth
    };

    return Promise(function(resolve) {
        resolve(state);
    });
};

var buildPGSchema = function() {
    var script = fs.readFileSync('./app/seedProject/tests/integrationTests/sql/buildSchema.sql').toString();
    return state.readstorerepository.query(script);
};

var sendMetadata = function() {
    return Promise(function(resolve) {
        state.eventstore.gesClientHelpers.setStreamMetadata('$all', state.setData, function(error, data) {
            resolve(error);
        })
    });
};

var sendBootstrap = function(error) {
    console.log("sending bootstrap");
    var appendData    = {expectedVersion: -2};
    appendData.events = [
        state.eventdata('bootstrapApplication',
            {data: 'bootstrap please'},
            {
                commandTypeName: 'bootstrapApplication',
                streamType     : 'command'
            })
    ];
    return state.eventstore.appendToStreamPromise('bootstrapApplication', appendData);
};

var runStateScript = function() {
    return state.readstorerepository.query(stateScript);
};

var startDispatching = function() {
    state.eventdispatcher.startDispatching(state.handlers);
};

module.exports = function(options) {
    console.log('here')
    extend(options, config.get('configs') || {});
    var container          = registry(options);
    var state = {
        eventmodels        : container.getInstanceOf('eventmodels'),
        eventdata          : eventmodels.eventData,
        eventstore         : container.getInstanceOf('eventstore'),
        handlers           : container.getArrayOfGroup('CommandHandlers'),
        readstorerepository: container.getInstanceOf('readstorerepository'),
        eventdispatcher    : container.getInstanceOf('eventdispatcher')
    };

    setupBootstrap(state)
        .bind(state)
        .then(buildPGSchema)
        .then(sendMetadata)
        .then(sendBootstrap)
        .catch(function(err) {
            console.log(err);
        });
}();