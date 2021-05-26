const wit_send = require('../wit_client')
const random_index = require('./utils/random_helper')
const context_handling = require('./context_handler')

let IntentHandler = undefined

module.exports.init_engine = function init_engine(handlerCollection) {
    IntentHandler = handlerCollection 
    console.log('chatbot initialized')
}

const notFoundResponsePool = [
    "Mình không hiểu bạn đang nói gì :l",
    "Mình xin lỗi mình không hiểu bạn đang nói gì",
]

const uncertainResponsePool = [
    "Mình không chắc bạn đang nói gì",
    "Bạn có thể nói rõ hơn cho mình được không?"
]

module.exports.get_response = function get_response(input, option = {}, context = {}) {
    return new Promise(async (resolve, reject) => {
        let parsed_data = await wit_send(input)

        let response = ""
        //check for intent
        if (parsed_data.intents.length != 0) {
            if (parsed_data.intents[0].confidence < 0.8) response = uncertainResponsePool[random_index(uncertainResponsePool.length)]
            else {
                let intent = IntentHandler.get(parsed_data.intents[0].name)
                if (intent) {
                    let entities = parsed_data.entities;
                    [response, context] = await intent.run(entities, option, context)
                }
                else {
                    response = "Chức năng chưa được xây dựng"
                }
            }
        }
        else if (context.active_context.length != 0) {
            [response, context] = await context_handling(parsed_data, input, option, context, IntentHandler)
        }
        else {
            response = notFoundResponsePool[random_index(notFoundResponsePool.length)]
        }
        context.past_client_message.push(input)
        if (context.past_client_message.length > 20) context.past_client_message.pop()
        context.past_bot_message.push(response)
        if (context.past_bot_message.length > 20) context.past_bot_message.pop()
        
        resolve([response, context])
    })
}