/**
 * Created by reharik on 1/7/16.
 */
var config = require('config');
var extend = require('extend');
var fs = require('fs');
var registry = require('./../registry');
var Promise = require('bluebird');


var setupBootstrap = function(state) {
    console.log('step1');
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

    return Promise.resolve(state);
};

var buildPGSchema = function() {
   console.log('step2');
    var script = fs.readFileSync(__dirname + '/sql/buildSchema.sql').toString();
    console.log('==========this.readstorerepository=========');
    console.log(this.readstorerepository.query.toString());
    console.log('==========ENDthis.readstorerepository=========');
    return this.readstorerepository.query(script);
};

var sendMetadata = function() {
    var that = this;
    return new Promise(function(resolve) {
        setTimeout(function() {
            that.eventstore.gesClientHelpers.setStreamMetadata('$all', that.setData, function(error, data) {
                resolve(error);
            })
        }, 2000)
    });
};

var sendBootstrap = function(error) {
    console.log('step4');
    console.log("sending bootstrap");
    var appendData    = {expectedVersion: -2};
    appendData.events = [
        this.eventdata('bootstrapApplication',
            {data: 'bootstrap please'},
            {
                commandTypeName: 'bootstrapApplication',
                streamType     : 'command'
            })
    ];
    return this.eventstore.appendToStreamPromise('bootstrapApplication', appendData);
};

var runStateScript = function() {
    return this.readstorerepository.query(stateScript);
};

var startDispatching = function() {
    this.eventdispatcher.startDispatching(this.state.handlers);
};

module.exports = function(_options) {
    var options = extend(_options, config.get('configs') || {});
    var container          = registry(options);
    //console.log(container.whatDoIHave({showAll:true}));
    var eventmodels = container.getInstanceOf('eventmodels');
    var state = {
        eventmodels        : eventmodels,
        eventdata          : eventmodels.eventData,
        eventstore         : container.getInstanceOf('eventstore'),
        handlers           : container.getArrayOfGroup('CommandHandlers'),
        readstorerepository: container.getInstanceOf('readstorerepository'),
        eventdispatcher    : container.getInstanceOf('eventdispatcher')
    };
    console.log('step0');

    setupBootstrap(state)
        .bind(state)
        .then(buildPGSchema)
        .then(sendMetadata)
        .then(sendBootstrap)
        .catch(function(err) {
            console.log(err);
        });
}();