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
            let interval = entities.find((val) => val.entity === "interval")
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (enough_entity && !interval) {
                response = "Bạn có thể cho mình biết tần suất thông báo được không?"
                context_intent_entry.missing_entities.push('interval')
                enough_entity = false
                context.suggestion_list = ['Mỗi ngày', 'Mỗi giờ', 'Mỗi tuần']
            }
            else {              
                context_intent_entry.confirmed_entities.push(interval)
            }

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                let interval_val = interval.resolution.value
                response = `Bạn có muốn đặt thông báo tin tức ${interval.utteranceText} từ ${(new Date(interval_val.start_time)).toLocaleString('vi-VN', {timeZone: 'Asia/Saigon'})}`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                // create a subscription (server-side?)
                let interval_val = interval.resolution.value
                action = {
                    action: "REQUEST_NOTIFICATION",
                    data: {
                        message: "activity:news", 
                        time: interval_val.start_time,
                        interval: interval_val.interval,
                        type: 'interval'
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

module.exports.name = "req_news_notif"

module.exports.isEnable = true