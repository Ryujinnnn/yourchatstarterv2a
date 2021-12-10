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
            let phrase = entities.find((val) => val.entity === "phrase")
            let date = entities.find((val) => val.entity === "date")
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (!phrase) {
                response = "Bạn có thể nói nội dung nhắc lại được không?"
                context_intent_entry.missing_entities.push('phrase')
                enough_entity = false
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
            else {
                context_intent_entry.confirmed_entities.push(phrase)
            }

            if (enough_entity && !date) {
                response = "Bạn có thể cho mình biết bạn muốn được nhắc khi nào được không?"
                context_intent_entry.missing_entities.push('date')
                enough_entity = false
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
            else {              
                context_intent_entry.confirmed_entities.push(date)
            }

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                let phrase_val = phrase.utteranceText
                let date_val = date.resolution.value
                response = `Bạn có muốn đặt thông báo nội dung ${phrase_val} lúc ${date_val.toLocaleString('vi-VN')}`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                // create a subscription (server-side?)
                let phrase_val = phrase.utteranceText
                let date_val = date.resolution.value
                action = {
                    action: "REQUEST_NOTIFICATION",
                    data: {
                        message: phrase_val, 
                        time: date_val, 
                        type: 'one-time'
                    }
                }
                response = `Tôi đã đặt thông báo cho bạn rồi nhé`
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
            
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "req_notification"

module.exports.isEnable = true