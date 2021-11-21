const wit_send = require('../wit_client')

module.exports = (parsed_data, input, option, context, IntentHandler) => {
    return new Promise(async (resolve, reject) => {
        let response = "default response"
        //TODO: redesign this garbage

        context.context_stack.pop()

        resolve([response, context])
    })  
}