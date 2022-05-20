
/*

PLANNING TIME

const intent_stack_entry = {
    intent: "",
    extra_entity: [],
    confirmed_entities: [],
    missing_entites: [],
}

const context = {
    intent_stack: [],
    information_key: [],
    suggestion_list: []
}

*/

module.exports = (parsed_data, input, option, context, IntentHandler) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        let action = {}
        //console.log(context)
        if (!context.intent_stack || !context.information_key || !context.suggestion_list) {
            resolve([response, context, action])
            return
        }
        let entities = parsed_data.entities
        if (context.intent_stack && context.intent_stack.length >= 0) {
            //try to figure out if user input match any possible entity fit an entry from all the missing_modifier 
            let intent_stack = context.intent_stack
            //examine the intent stack from top to bottom

            let intent_updated = false
            for (let i = intent_stack.length - 1; i >= 0; i--) {
                console.log(intent_stack[i])
                entities.forEach((entity_entry) => {
                    //check if missing entity contain the pending entity
                    if (intent_stack[i].missing_entities.includes(entity_entry.entity)) {
                        entity_entry.from_context = true
                        intent_stack[i].confirmed_entities.push(entity_entry)
                        intent_updated = true
                    }
                })

                if (intent_updated) {
                    // if the closest to the stack have its entity updated, retry the intent with the new entities
                    let intent = IntentHandler.get(intent_stack[i].intent)
                    if (intent) {
                        if (intent.name === "ask_calc") [response, context, action] = await intent.run(intent_stack[i].confirmed_entities, option, context, input, true)
                        else [response, context, action] = await intent.run(intent_stack[i].confirmed_entities, option, context, true)
                    }
                    else {
                        answer = "Chức năng chưa được xây dựng"
                    }
                    context.intent_stack.splice(i, 1)
                    break
                }
            }
        }
        while (context.intent_stack.length > 15) {
            context.intent_stack.shift()
        }
        resolve([response, context, action])
    })  
}