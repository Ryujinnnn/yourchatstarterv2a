const wit_send = require('../wit_client')

module.exports = (parsed_data, input, option, context, IntentHandler) => {
    return new Promise(async (resolve, reject) => {
        let response = "default response"
        if (context.active_context[0] == "get_weather_need_location") {
            // console.log(IntentHandler)
            let entities = parsed_data.entities;
            if (entities['wit$location:location']) {
                let intent = await IntentHandler.get("ask_weather")
                context.active_context.shift()
                
                let context_response
                [context_response, context] = await intent.run(entities, option, context)
                resolve([context_response, context])
            }
            else {
                response = "Xin lỗi bạn mình vẫn không biết bạn muốn tìm địa điểm nào"
                resolve([response, context])
            }
        }
        else if (context.active_context[0] == "get_more_news") {
            let entities = parsed_data.entities
            if (entities['news_category:news_category']) {
                let intent = await IntentHandler.get("ask_news")
                context.active_context.shift()

                let context_response
                [context_response, context] = await intent.run(entities, option, context)
                resolve([context_response, context])
            }
            else if (input.toLowerCase().includes('không')) {
                response = 'Ok nhé, bạn có thể tiếp tục hỏi mình những chủ đề bên dưới'
                context.active_context.shift()
                context.suggestion_list = ['Tình hình covid như thế nào?', 'Thời tiết ở Thành phố Hồ Chí Minh như thế nào', '1 USD đổi ra bao nhiêu VND?']
                resolve([response, context])
            }
            else {
                response = "Mình chưa rõ bạn muốn tìm kiếm thông tin theo chủ đề nào"
                context.active_context.shift()
                context.suggestion_list = ['Tình hình covid như thế nào?', 'Thời tiết ở Thành phố Hồ Chí Minh như thế nào', '1 USD đổi ra bao nhiêu VND?']
                resolve([response, context])
            }
        }
        else {
            response = "Ngữ cảnh không xác định"
            resolve([response, context])
        }
    })  
}