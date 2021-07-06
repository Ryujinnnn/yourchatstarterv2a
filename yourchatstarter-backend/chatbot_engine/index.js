const wit_client = require('../wit_client')
const random_index = require('./utils/random_helper')
const context_handling = require('./context_handler')
const { wiki_query } = require('../info_module/wikidata_info')

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
        let response = ""
        if (!input) {
            response = "Tin nhắn của bạn quá ngắn, hãy gõ thêm gì đó vào nhé =)"
        }
        else if (input.length > 270) {
            response = "Tin nhắn của bạn quá dài, hãy cố gõ dưới 270 kí tự thôi nhé =)"
        }
        else {
            let parsed_data = await wit_client.parse(input)
            //check for intent
            let uncertain_flag = false
            if (parsed_data.intents.length != 0) {
                if (parsed_data.intents[0].confidence < 0.8) uncertain_flag = true
                else {
                    let intent = IntentHandler.get(parsed_data.intents[0].name)
                    if (intent) {
                        
                        let entities = parsed_data.entities;
                        if (intent.name === "ask_calc") [response, context] = await intent.run(entities, option, context, input)
                        else [response, context] = await intent.run(entities, option, context)
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
                //TODO: resolve description into vietnamese, somehow
                await wiki_query(parsed_data.text).then(wiki_res => {
                    response = wiki_res[0].label + " là " + wiki_res[0].description 
                })
                .catch(() => {
                    response = notFoundResponsePool[random_index(notFoundResponsePool.length)]
                })
            }
            if (!response && uncertain_flag) response = uncertainResponsePool[random_index(uncertainResponsePool.length)]
        }

        context.past_client_message.push(input)
        if (context.past_client_message.length > 20) context.past_client_message.pop()
        context.past_bot_message.push(response)
        if (context.past_bot_message.length > 20) context.past_bot_message.pop()
        
        resolve([response, context])
    })
}

module.exports.get_response_from_voice = function get_response_from_voice(data, option = {}, context = {}) {
    return new Promise(async (resolve, reject) => {
        // let parsed_data = await wit_send(input)
        // make request to wit.ai endpoint directly

        let parsed_data = await wit_client.voice(data)
        let response = ""
        //check for intent
        let uncertain_flag = false
        if (parsed_data.intents.length != 0) {
            if (parsed_data.intents[0].confidence < 0.8) uncertain_flag = true
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
            //try a wikidata query
            //TODO: resolve description into vietnamese, somehow
            await wiki_query(parsed_data.text).then(wiki_res => {
                response = wiki_res[0].label + " là " + wiki_res[0].description 
            })
            .catch(() => {
                response = notFoundResponsePool[random_index(notFoundResponsePool.length)]
            })
        }

        if (!response && uncertain_flag) response = uncertainResponsePool[random_index(uncertainResponsePool.length)]
        context.past_client_message.push(parsed_data.text)
        if (context.past_client_message.length > 20) context.past_client_message.pop()
        context.past_bot_message.push(response)
        if (context.past_bot_message.length > 20) context.past_bot_message.pop()
        
        resolve([response, context])
    })
}