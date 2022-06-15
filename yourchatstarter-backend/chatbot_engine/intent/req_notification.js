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
            let phrase = entities.find((val) => val.entity === "phrase")
            let date = entities.find((val) => val.entity === "date")
            let affirmation = entities.find((val) => val.entity === "affirmation")

            if (!phrase) {
                response = "Bạn có thể nói nội dung nhắc lại được không?"
                context_intent_entry.missing_entities.push('phrase')
                enough_entity = false
                context.suggestion_list = ['"Ra quán ăn"', '"Đi mua đồ"', '"Đi ngủ"', '"Làm bài tập"']
            }
            else {
                context_intent_entry.confirmed_entities.push(phrase)
            }

            if (enough_entity && !date) {
                response = "Bạn có thể cho mình biết bạn muốn được nhắc khi nào được không?"
                context_intent_entry.missing_entities.push('date')
                enough_entity = false
                context.suggestion_list = ['Sau 5 phút nữa', 'ngày mai', 'sau 1 giờ nữa']
            }
            else if (date) {              
                context_intent_entry.confirmed_entities.push(date)
            }

            if (enough_entity && (!affirmation || !affirmation.from_context)) {
                let phrase_val = phrase.utteranceText.replace(/\"/g, '')
                let date_val = new Date(date.resolution.value)
                
                response = `Bạn có muốn đặt thông báo nội dung "${phrase_val}" lúc ${date_val.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}`
                context_intent_entry.missing_entities.push('affirmation')
                context.suggestion_list = ['Đồng ý', 'Hủy bỏ']
                enough_entity = false
            }

            if (enough_entity) {
                // create a subscription (server-side?)
                let phrase_val = phrase.utteranceText.replace(/\"/g, '')
                let date_val = date.resolution.value
                let affirmation_val = affirmation.resolution.value

                if (affirmation_val === "no") {
                    response = `Tôi sẽ không dặt thông báo cho bạn nhé`
                }
                else {
                    action = {
                        action: "REQUEST_NOTIFICATION",
                        data: {
                            message: phrase_val, 
                            time: date_val, 
                            type: 'one-time'
                        }
                    }
                    response = `Tôi đã đặt thông báo cho bạn rồi nhé`
                }
                let start_index = random_helper(smalltalk_suggestion.length)
                context.suggestion_list = ["Cảm ơn"].concat(smalltalk_suggestion.slice_wrap(start_index, (start_index + 3) % smalltalk_suggestion.length))
            }
            
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "req_notification"

module.exports.isEnable = true