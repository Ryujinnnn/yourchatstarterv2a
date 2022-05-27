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
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                response = `Bạn có muốn hủy nhận thông báo thời tiết`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                action = {
                    action: "CANCEL_NOTIFICATION",
                    data: {
                        message: "activity:weather", 
                        time: new Date().toISOString(),
                        type: 'interval'
                    }
                }
                response = `Tôi đã hủy thông báo cho bạn rồi nhé`
                
                let start_index = random_helper(smalltalk_suggestion.length)
                context.suggestion_list = ["Cảm ơn"].concat(smalltalk_suggestion.slice_wrap(start_index, (start_index + 3) % smalltalk_suggestion.length))
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "cancel_weather_notif"

module.exports.isEnable = true