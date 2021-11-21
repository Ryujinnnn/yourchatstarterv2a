const initial_context = {
    infomation_key: [],
    context_stack: [],
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