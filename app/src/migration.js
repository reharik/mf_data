var pgasync = require('pg-async');
var config = require('config');
var DBMigrate = require( 'db-migrate' );

module.exports = function(pgasync, config, dbmigrate) {
  return async function () {
    console.log(`=========="in migrator=========`);
    console.log("in migrator");
    console.log(`==========END "in migrator=========`);
    try {
      const configs = config.configs.children.postgres.config;
      configs.driver = "pg";
      var migrator = dbmigrate.getInstance(true, {config: {dev: configs}, cwd:'./app' });

      await migrator.reset();
      await migrator.up();
    }catch(ex){
      console.log(`==========ex=========`);
      console.log(ex);
      console.log(`==========END ex=========`);
    }
    console.log(`=========="migrator complete"=========`);
    console.log("migrator complete");
    console.log(`==========END "migrator complete"=========`);
    // var pg = new pgasync.default(config.postgres.config);
    // // generate default data
    // var _data = data();

  };
};
