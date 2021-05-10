const wit_send = require('../wit_client')

let IntentHandler = undefined

module.exports.init_engine = function init_engine(handlerCollection) {
    IntentHandler = handlerCollection 
    console.log('chatbot initialized')
}

module.exports.get_response = function get_response(input, option = {}, context = {}) {
    return new Promise(async (resolve, reject) => {
        let parsed_data = await wit_send(input)

        //check for intent
        if (parsed_data.intents.length == 0) response = "Mình không hiểu bạn đang nói gì :l"
        else if (parsed_data.intents[0].confidence < 0.8) response = "Mình không chắc bạn đang nói gì" 
        else {
            let intent = IntentHandler.get(parsed_data.intents[0].name)
            if (intent) {
                let entities = parsed_data.entities
                let response = await intent.run(entities, option, context)
                resolve(response)
            }
            else {
                resolve("clgt?")
            }
        }
    })
}