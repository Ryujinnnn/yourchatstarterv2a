module.exports.run = (entities, option, context, isLocal = true) => {
    let response = ""

    let context_intent_entry = {
        intent: this.name,
        addition_entities: [],
        confirmed_entities: [],
        missing_entities: []
    }

    let action = {}

    if (isLocal) {
        let app_name = entities.find((val) => val.entity === "app_name")
        if (!app_name) {
            response = "Bạn có thể nói rõ ứng dụng nào được không?"
            context_intent_entry.missing_entities.push('app_name')
            context.intent_stack.push(context_intent_entry)
        }
        else {
            let app_name_value = app_name.option
            action = {
                action: "REQUEST_OPENAPP",
                data: {
                    message: `app:${app_name_value}`, 
                    time: new Date(), 
                    type: 'one-time'
                }
            }
            response = `Tôi sẽ mở ứng dụng ${app_name_value} cho bạn`
            context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
        }
    }

    return [response, context, action]
}

module.exports.name = "req_open_app"

module.exports.isEnable = true