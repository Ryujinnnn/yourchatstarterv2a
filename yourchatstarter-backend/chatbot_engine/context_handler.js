
/*

PLANNING TIME

const intent_stack_entry = {
    intent: "",
    add_modifier: [],
    missing_modifier: [],
}

const context = {
    intent_stack: [],
    information_key: [],
    suggestion_list: []
}

*/

module.exports = (parsed_data, input, option, context, IntentHandler) => {
    return new Promise(async (resolve, reject) => {
        let response = "default response"
        //TODO: redesign this garbage

        if (context.intent_stack.length >= 0) {

        }
        
        context.context_stack.pop()

        resolve([response, context])
    })  
}