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
            let notification_type = entities.find((val) => val.entity === "notification_type")
            let interval = entities.find((val) => val.entity === "interval")
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (!notification_type) {
                response = "Bạn có thể cho loại thông báo lại được không?"
                context_intent_entry.missing_entities.push('notification_type')
                enough_entity = false
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
            else {
                context_intent_entry.confirmed_entities.push(notification_type)
            }

            if (enough_entity && !interval) {
                response = "Bạn có thể cho mình biết tần suất thông báo được không?"
                context_intent_entry.missing_entities.push('interval')
                enough_entity = false
                context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
            }
            else {              
                context_intent_entry.confirmed_entities.push(interval)
            }

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                let notification_val = notification_type.utteranceText
                let interval_val = interval.resolution.value
                response = `Bạn có muốn đặt thông báo nội dung ${notification_val} ${interval.utteranceText} từ ${(new Date(interval_val.start_time)).toLocaleString('vi-VN', {timeZone: 'Asia/Saigon'})}`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                // create a subscription (server-side?)
                let notification_val = notification_type.option
                let interval_val = interval.resolution.value
                action = {
                    action: "REQUEST_NOTIFICATION",
                    data: {
                        message: "activity:" + notification_val, 
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

module.exports.name = "req_fetch_notif"

module.exports.isEnable = true