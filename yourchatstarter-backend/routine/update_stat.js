const db = require('../database/database_interaction')
const { session_storage } = require ('../database/session_storage')

module.exports.updateStat = async () => {
    console.log(session_storage)

    const new_timeseries = {
        time: new Date(),
        message_receive: session_storage.message_receive,
        defined_intent: session_storage.defined_intent,
        slot_filling: session_storage.slot_filling,
        freeform_search: session_storage.freeform_search,
        unknown_intent: session_storage.unknown_intent
    }

    let stat_res = await db.addRecord('message_stat', new_timeseries).catch(e => console.log(e))

    if (stat_res) {
        session_storage.message_receive = 0
        session_storage.defined_intent = 0
        session_storage.slot_filling = 0
        session_storage.freeform_search = 0
        session_storage.unknown_intent = 0
    }

    //reset
}