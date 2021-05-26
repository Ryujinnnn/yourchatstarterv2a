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
        else {
            response = "Ngữ cảnh không xác định"
            resolve([response, context])
        }
    })  
}