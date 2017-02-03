require('babel-polyfill');
require('babel-register');


// var config = require('config');
// var extend = require('extend');
// var fs = require('fs');
// var registry = require('./../registry');
// var Promise = require('bluebird');
// var uuid = require('uuid');
// var ges = require('ges-eventsourcing');
var ef;
// var eventstore = ges.ev;
// var handlers;
// var rsRepository;
// var eventDispatcher;

module.exports = function(config,
                          extend, 
                          Promise, 
                          uuid, 
                          eventstore, 
                          messageBinders,
                          migration,
                          bcryptjs) {
  return function () {
    var ef;

    var createPassword = function (_password) {
      try {
        var salt = bcryptjs.genSaltSync(10);
        var hash = bcryptjs.hashSync(_password, salt);
        return hash;
      }
      catch (err) {
        throw err;
      }
    };

    var setupMetaData = function () {
      console.log('step1');
      var auth = {
        username: eventstore.gesClientHelpers.systemUsers.admin,
        password: eventstore.gesClientHelpers.systemUsers.defaultAdminPassword
      };
      var metadata = eventstore.gesClientHelpers.createStreamMetadata({
        acl: {
          readRoles: eventstore.gesClientHelpers.systemRoles.all
        }
      });
      return {
        expectedMetastreamVersion: -2,
        metadata: metadata,
        auth: auth
      };
    };

    var sendMetadata = function (val) {
      var setData = setupMetaData();
      console.log('step2');
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
        eventstore.gesClientHelpers.setStreamMetadata('$all', setData, function (error, data) {
          if(error){
            reject(error);
          }
          else {
            resolve(data);
          }
        });
        }, 1000)
      });
    };

    var sendBootstrap = function (error) {
      console.log('step4');
      console.log("sending bootstrap");
      var appendData = {expectedVersion: -2};
      appendData.events = [
        ef.outGoingEvent({
          eventName: 'bootstrapApplication',
          data: {message: 'bootstrap please'},
          metadata: {
            continuationId: uuid.v4(),
            commandTypeName: 'bootstrapApplication',
            streamType: 'command'
          }
        })
      ];
      return eventstore.appendToStreamPromise('bootstrapApplication', appendData);
    };

    var processCommands = async function (x, commandName) {
      const command = messageBinders.commands[commandName + 'Command'](x);

      await messageBinders.commandPoster(
        command,
        commandName,
        uuid.v4());
    };

    var populateES = async function () {
      const clients = addClients();
      for (let x of clients) {
        await processCommands(x, 'addClient');
      }

      const trainers = hireTrainers();
      trainers[1].clients = [clients[0].id,clients[1].id,clients[2].id];
      trainers[2].clients = [clients[2].id,clients[3].id,clients[4].id];
      for (let x of trainers) {
        await processCommands(x, 'hireTrainer');
      }
    };


    var populatePG = function () {
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

      return new Promise(function (resolve, reject) {
        rsRepository.query(stateScript).fork(reject, resolve)
      })
    };

    var start = function () {
      return buildPGSchema()
        .then(sendMetadata)
        .then(sendBootstrap)
        .then((x) => {
          populatePG();
          console.log('data complete')
        })
        .catch(function (err) {
          console.log(err);
        });
    };


    const hireTrainers = () => {
      const one = {
        birthDate: new Date('1/5/1972'),
        color: '#4286f4',
        firstName: 'Raif',
        lastName: 'Harik',
        email: 'admin',
        mobilePhone: '666.666.6666',
        secondaryPhone: '777.777.7777',
        password: createPassword('123123'),
        role: 'admin',
        street1: '1706 willow st',
        street2: 'b',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702'
      };
      const two = {
        birthDate: new Date('1/5/1972'),
        color: 'f442e8',
        firstName: 'MyTwin',
        lastName: 'Harik',
        email: 'trainer',
        mobilePhone: '666.666.6666',
        secondaryPhone: '777.777.7777',
        password: createPassword('123123'),
        role: 'trainer',
        street1: '1706 willow st',
        street2: 'a',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702'
      };

      const three = {
        birthDate: new Date('2/11/1969'),
        color: 'f46842',
        firstName: 'Amahl',
        lastName: 'Harik',
        email: 'trainer',
        mobilePhone: '555.555.5555',
        secondaryPhone: '777.777.7777',
        password: createPassword('123123'),
        role: 'trainer',
        street1: '1 Richmond Square',
        street2: 'a',
        city: 'Providence',
        state: 'RI',
        zipCode: '02906'
      };

      return [one, two, three];
    };

    const addClients = () => {
      const one = {
        firstName: 'Hanna',
        lastName: 'Abelow',
        secondaryPhone: '',
        mobilePhone: '9172394046',
        email: 'hc.abelow@gmail.com',
        street1: '77 Overhill Road',
        street2: '',
        city: 'Providence',
        state: 'RI',
        zipCode: '02916',
        source: 'referral',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };

      const two = {
        firstName: 'Jessica',
        lastName: 'Ahern',
        secondaryPhone: '',
        mobilePhone: '774.219.3504',
        email: 'ahern.jessica@yahoo.com',
        street1: '3 Thompson St.',
        street2: '',
        city: 'Providence',
        state: 'RI',
        zipCode: '02903',
        source: 'printAd',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const three = {
        firstName: 'Anthony',
        lastName: 'Akkaoui',
        secondaryPhone: '',
        mobilePhone: '401.383.5574',
        email: 'anthony.akkaoui@gmail.com',
        street1: '1169 Bullocks Point Ave',
        street2: '',
        city: 'Providence',
        state: 'RI',
        zipCode: '02915',
        source: 'referral',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const four = {
        firstName: 'Amanda',
        lastName: 'Avedissian',
        secondaryPhone: '',
        mobilePhone: '401-573-9700',
        email: 'amanda.avedissian@gmail',
        street1: 'PO Box 985',
        street2: '',
        city: 'Bristol',
        state: 'RI',
        zipCode: '02809',
        source: 'webSearch',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const five = {
        firstName: 'Sarah',
        lastName: 'Barr',
        secondaryPhone: '',
        mobilePhone: '4018298481',
        email: 'barr.sarahk@gmail.com',
        street1: '35 Crescent St',
        street2: '',
        city: 'Waltham',
        state: 'MA',
        zipCode: '02403',
        source: 'walkDriveBy',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };

      return [one, two, three, four, five]
    };

    const begin = async function () {
      await migration();
      console.log('step0');
      await sendMetadata();
      console.log('step3');
      await populateES();

    };

    begin();
  };
};
//
// module.exports = function(_options) {
//   // var options         = extend(_options, config.get('configs') || {});
//   // var container       = registry(options);
//   // var appfuncs     = container.getInstanceOf('appfuncs');
//   // ef           = appfuncs.eventFunctions;
//   // eventstore          = container.getInstanceOf('eventstore');
//   // handlers            = container.getArrayOfGroup('CommandHandlers');
//   // rsRepository = container.getInstanceOf('rsRepository');
//   // //eventdispatcher     = container.getInstanceOf('eventdispatcher');
//
//   begin();
// }();