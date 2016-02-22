/**
 * Created by reharik on 1/7/16.
 */
var config = require('config');
var extend = require('extend');
var fs = require('fs');
var registry = require('./../registry');
var Promise = require('bluebird');
var uuid = require('uuid');
var ef;
var eventstore;
var handlers;
var readstorerepository;
var eventdispatcher;



var setupBootstrap = function() {
    console.log('step1');
    var auth      = {
        username: eventstore.gesClientHelpers.systemUsers.admin,
        password: eventstore.gesClientHelpers.systemUsers.defaultAdminPassword
    };
    var metadata  = eventstore.gesClientHelpers.createStreamMetadata({
        acl: {
            readRoles: eventstore.gesClientHelpers.systemRoles.all
        }
    });
    return {
        expectedMetastreamVersion: -1,
        metadata                 : metadata,
        auth                     : auth
    };
};

var buildPGSchema = function() {
    console.log('step2');
    var script = fs.readFileSync(__dirname + '/sql/buildSchema.sql').toString();
    return new Promise(function(resolve, reject) {
        readstorerepository.query(script).fork(reject,resolve)
    })
};

var populatePG = function() {
    var stateScript =
            "begin; " +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AK\", \"Name\":\"Alaska\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AZ\", \"Name\":\"Arizona\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AR\", \"Name\":\"Arkansas\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CA\", \"Name\":\"California\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CO\", \"Name\":\"Colorado\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CT\", \"Name\":\"Connecticut\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"DE\", \"Name\":\"Delaware\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"DC\", \"Name\":\"District Of Columbia\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"FL\", \"Name\":\"Florida\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"GA\", \"Name\":\"Georgia\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"HI\", \"Name\":\"Hawaii\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ID\", \"Name\":\"Idaho\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IL\", \"Name\":\"Illinois\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IN\", \"Name\":\"Indiana\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IA\", \"Name\":\"Iowa\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"KS\", \"Name\":\"Kansas\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"KY\", \"Name\":\"Kentucky\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"LA\", \"Name\":\"Louisiana\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ME\", \"Name\":\"Maine\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MD\", \"Name\":\"Maryland\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MA\", \"Name\":\"Massachusetts\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MI\", \"Name\":\"Michigan\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MN\", \"Name\":\"Minnesota\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MS\", \"Name\":\"Mississippi\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MO\", \"Name\":\"Missouri\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MT\", \"Name\":\"Montana\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NE\", \"Name\":\"Nebraska\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NV\", \"Name\":\"Nevada\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NH\", \"Name\":\"New Hampshire\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NJ\", \"Name\":\"New Jersey\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NM\", \"Name\":\"New Mexico\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NY\", \"Name\":\"New York\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NC\", \"Name\":\"North Carolina\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ND\", \"Name\":\"North Dakota\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OH\", \"Name\":\"Ohio\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OK\", \"Name\":\"Oklahoma\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OR\", \"Name\":\"Oregon\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"PA\", \"Name\":\"Pennsylvania\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"RI\", \"Name\":\"Rhode Island\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"SC\", \"Name\":\"South Carolina\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"SD\", \"Name\":\"South Dakota\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"TN\", \"Name\":\"Tennessee\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"TX\", \"Name\":\"Texas\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"UT\", \"Name\":\"Utah\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"VT\", \"Name\":\"Vermont\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"VA\", \"Name\":\"Virginia\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WA\", \"Name\":\"Washington\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WV\", \"Name\":\"West Virginia\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WI\", \"Name\":\"Wisconsin\"}' );" +
            "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WY\", \"Name\":\"Wyoming\"}' );" +
            "commit;";

    return new Promise(function(resolve, reject) {
        readstorerepository.query(stateScript).fork(reject, resolve)
    })
};

var sendMetadata = function(val) {
    var setData = setupBootstrap();

    return new Promise(function(resolve) {
        setTimeout(function() {
            eventstore.gesClientHelpers.setStreamMetadata('$all', setData, function(error, data) {
                resolve(error);
            })
        }, 1000)
    });
};

var sendBootstrap = function(error) {
    console.log('step4');
    console.log("sending bootstrap");
    var appendData    = { expectedVersion: -2 };
    appendData.events = [
        ef.outGoingEvent({
            eventName: 'bootstrapApplication',
            data     : { message: 'bootstrap please' },
            metadata : {
                commandTypeName: 'bootstrapApplication',
                streamType     : 'command'
            }
        })
    ];
    console.log('==========appendData.events=========');
    console.log(appendData.events);
    console.log('==========ENDappendData.events=========');
    return eventstore.appendToStreamPromise('bootstrapApplication', appendData);
};

module.exports = function(_options) {
    var options         = extend(_options, config.get('configs') || {});
    var container       = registry(options);
    var appfuncs     = container.getInstanceOf('appfuncs');
    ef           = appfuncs.eventFunctions;
    eventstore          = container.getInstanceOf('eventstore');
    handlers            = container.getArrayOfGroup('CommandHandlers');
    readstorerepository = container.getInstanceOf('readstorerepository');
    //eventdispatcher     = container.getInstanceOf('eventdispatcher');

    console.log('step0');
    return buildPGSchema()
        .then(sendMetadata)
        .then(sendBootstrap)
        .then(populatePG)
        .catch(function(err) {
            console.log(err);
        });
}();