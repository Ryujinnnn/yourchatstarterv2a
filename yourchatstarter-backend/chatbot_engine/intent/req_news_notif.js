const { smalltalk_suggestion } = require('../../database/session_storage')
const random_helper = require('../utils/random_helper')

Array.prototype.slice_wrap = function (start, end) {
    if (start <= end) {
        return this.slice(start, end)
    }
    else {
        return this.slice(start).concat(this.slice(0, end))
    }
}

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
                response = `Bạn có muốn đặt thông báo tin tức ${interval.utteranceText} từ ${(new Date(interval_val.start_time)).toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                // create a subscription (server-side?)
                let interval_val = interval.resolution.value
                let affirmation_val = affirmation.resolution.value

                if (affirmation_val === "no") {
                    response = `Tôi sẽ không dặt thông báo cho bạn rồi nhé`
                }
                else {
                    action = {
                        action: "REQUEST_NOTIFICATION",
                        data: {
                            message: "activity:news", 
                            time: new Date(interval_val.start_time).toISOString(),
                            interval: interval_val.interval,
                            type: 'interval'
                        }
                    }
                    response = `Tôi đã đặt thông báo cho bạn nhé`
                }
                let start_index = random_helper(smalltalk_suggestion.length)
                context.suggestion_list = ["Cảm ơn"].concat(smalltalk_suggestion.slice_wrap(start_index, (start_index + 3) % smalltalk_suggestion.length))
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "req_news_notif"

module.exports.isEnable = true