//global scope storage LOL

module.exports.session_storage = {
    message_receive: 0,
    defined_intent: 0,
    freeform_search: 0,
    slot_filling: 0,
    unknown_intent: 0,

    positive_utterance: 0,
    neutral_utterance: 0,
    negative_utterance: 0,

    falcon_available: false
}

module.exports.service_access_tier = {
    "ask_crypto": ["standard", "premium", "lifetime"],
    "ask_exchange_rate": ["standard", "premium", "lifetime"],
    "ask_stock": ["standard", "premium", "lifetime"],
    "req_translate": ["premium", "lifetime"],
}

module.exports.smalltalk_suggestion = []