const db = require('../database/database_interaction')
const { session_storage } = require ('../database/session_storage')

module.exports.updateStat = async () => {
    //console.log(session_storage)

    const new_timeseries = {
        time: new Date(),
        message_receive: session_storage.message_receive,
        defined_intent: session_storage.defined_intent,
        slot_filling: session_storage.slot_filling,
        freeform_search: session_storage.freeform_search,
        unknown_intent: session_storage.unknown_intent,
        positive_utterance: session_storage.positive_utterance,
        neutral_utterance: session_storage.neutral_utterance,
        negative_utterance: session_storage.negative_utterance
    }

    let stat_res = await db.addRecord('message_stat', new_timeseries).catch(e => console.log(e))

    //reset stat

    if (stat_res) {
        session_storage.message_receive = 0
        session_storage.defined_intent = 0
        session_storage.slot_filling = 0
        session_storage.freeform_search = 0
        session_storage.unknown_intent = 0
        session_storage.positive_utterance = 0
        session_storage.neutral_utterance = 0
        session_storage.negative_utterance = 0
    }
}