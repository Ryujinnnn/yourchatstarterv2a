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
            //require entity is phrase and time_vi
            let enough_entity = true
            //console.log(entities)
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                // let interval_val = interval.resolution.value
                // let location = location_entity.option
                response = `Bạn có muốn hủy nhận thông báo tin tức`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                action = {
                    action: "CANCEL_NOTIFICATION",
                    data: {
                        message: "activity:news", 
                        time: new Date().toISOString(),
                        type: 'interval'
                    }
                }
                response = `Tôi đã hủy thông báo cho bạn rồi nhé`
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "cancel_news_notif"

module.exports.isEnable = true