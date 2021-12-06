module.exports.run = (entities, option, context, isLocal = true) => {
    return new Promise(async (resolve, reject) => {
        let response = ""

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
            let phrase = entities.find((val) => val.entity === "phrase")
            let date = entities.find((val) => val.entity === "date")

            if (!phrase) {
                response = "Bạn có thể nói nội dung nhắc lại được không?"
                context_intent_entry.missing_entities.push('phrase')
                enough_entity = false
            }

            if (!date) {
                response = "Bạn có thể cho mình biết bạn muốn được nhắc khi nào được không?"
                context_intent_entry.missing_entities.push('date')
                enough_entity = false
            }

            if (enough_entity) {
                let phrase_val = phrase.utteranceText
                let date_val = date.resolution.value
                response = `Bạn có muốn đặt thông báo nội dung ${phrase_val} lúc ${date_val.toLocaleString('vi-VN')}`
            }
            // create a subscription (server-side?)
        }
        context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
        context.intent_stack.push(context_intent_entry)
        resolve([response, context])
    })
}

module.exports.name = "req_notification"

module.exports.isEnable = true