const db = require('../database/database_interaction')
const session_storage = require('../database/session_storage')

module.exports.updateServicePermission = async () => {
    let sv_res = await db.queryRecord('service', {}, {})

    session_storage = sv_res
    //TODO: get db entry of the current service permission every 5 minutes
}