module.exports.run = (entities, option, context, isLocal = true) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (isLocal) {
            //require entity is phrase and time_vi
            let phrase = entities.find((val) => val.entity === "phrase")
            let time_vi = entities.find((val) => val.entity === "time_vi")

            if (!phrase) {
                response = "Bạn có thể nói nội dung nhắc lại được không?"
                context_intent_entry.missing_entities.push('phrase')
            }

            if (!time_vi) {
                response = "Bạn có thể cho mình biết bạn muốn được nhắc khi nào được không?"
                context_intent_entry.missing_entities.push('date')
            }
            // create a subscription (server-side?)
        }
        context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
        resolve([response, context])
    })
}

module.exports.name = "req_notification"

module.exports.isEnable = true