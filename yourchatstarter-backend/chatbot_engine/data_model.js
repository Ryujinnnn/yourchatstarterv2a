const initial_context = {
    past_client_message: [],
    past_bot_message: [],
    infomation_key: [],
    active_context: [],
    suggestion_list: [],
}

const initial_active_context = {
    name: "",
    acquired_info: [],
    missing_info: [],
}

const initial_response_data = {
    response: "",
    context: {}
}

module.exports.initial_context = initial_context
module.exports.initial_response_data = initial_response_data