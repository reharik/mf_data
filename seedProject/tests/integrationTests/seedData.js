/**
 * Created by rharik on 10/2/15.
 */

require('must');
var config = require('config');
var extend = require('extend');
var fs = require('fs');

describe('appendToStreamPromiseTester', function() {
    var eventdata;
    var uuid;
    var eventstore;
    var handlers;
    var options = {
        //dagon: {
        //    logger: {
        //        moduleName: 'EventHandlerBase'
        //    }
        //}
    };
    var container;
    var setData;
    var readstorerepository;
    var eventdispatcher;

    before(async function () {
        extend(options, config.get('configs') || {});
        container = require('../../registry')(options);
        var eventmodels = container.getInstanceOf('eventmodels');
        eventdata = eventmodels.eventData;
        eventstore = container.getInstanceOf('eventstore');
        uuid = container.getInstanceOf('uuid');
        handlers = container.getArrayOfGroup('CommandHandlers');
        readstorerepository = container.getInstanceOf('readstorerepository');
        eventdispatcher = container.getInstanceOf('eventdispatcher');
        var auth = {
            username: eventstore.gesClientHelpers.systemUsers.admin
            , password: eventstore.gesClientHelpers.systemUsers.defaultAdminPassword
        };
        setData = {
            expectedMetastreamVersion: -1
            , metadata: eventstore.gesClientHelpers.createStreamMetadata({
                acl: {
                    readRoles: eventstore.gesClientHelpers.systemRoles.all
                }
            })
            , auth: auth
        };
    });

    context('append to stream', ()=> {
        it('should resolve with success', async ()=> {
            var script = fs.readFileSync('tests/integrationTests/sql/buildSchema.sql').toString();
            await readstorerepository.query(script);
            await eventstore.gesClientHelpers.setStreamMetadata('$all', setData, async function (error, data) {
                if (!error) {
                    var appendData = {expectedVersion: -2};
                    appendData.events = [eventdata('bootstrapApplication',
                        {data: 'bootstrap please'},
                        {
                            commandTypeName: 'bootstrapApplication',
                            streamType: 'command'
                        })];
                    await eventstore.appendToStreamPromise('bootstrapApplication', appendData);
                }
            });
            await setTimeout(async function () {
                var result = await eventdispatcher.startDispatching(handlers);
            }, 1000);
        })
    });
});

