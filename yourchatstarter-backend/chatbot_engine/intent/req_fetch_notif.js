module.exports.run = (entities, option, context, isLocal = true) => {
    return new Promise(async (resolve, reject) => {
        let response = ""

        let action = {}

        let context_intent_entry = {
            intent: this.name,
            addition_entities: [],
            confirmed_entities: [],
            missing_entities: []
        }

        if (isLocal) {
            response = `Tôi đã đặt thông báo cho bạn rồi nhé`
            context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "req_fetch_notif"

module.exports.isEnable = false