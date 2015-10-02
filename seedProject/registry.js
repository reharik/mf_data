/**
 * Created by parallels on 9/3/15.
 */
var dagon = require('dagon');

module.exports = function(_options) {
    var options = _options || {};
    var container = dagon(options.dagon);
    var result;
    try {
        result = new container(x=> x.pathToRoot(__dirname)
            .for('eventmodels').instantiate(i=>i.asFunc())
            .for('eventstore').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventdispatcher').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('readstorerepository').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('corelogger').renameTo('logger').instantiate(i=>i.asFunc().withParameters(options.logger || {}))
            .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};