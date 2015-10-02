/**
 * Created by rharik on 10/2/15.
 */
require("babel/register")({
    stage: 1,
    ignore:[ 'uuid.js', 'rx.js', 'lodash', 'moment','ges-client', 'winston', 'nested-error']
});
