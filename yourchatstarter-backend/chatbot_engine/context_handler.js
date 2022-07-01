
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
const { session_storage, smalltalk_suggestion, service_access_tier } = require('../database/session_storage')

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
                //console.log(intent_stack[i])

                let missing_entity_type = intent_stack[i].missing_entities.map(val => val.replace(/_\d+/, ''))

                entities.forEach((entity_entry) => {
                    //check if missing entity contain the pending entity
                    //console.log(missing_entity_type)
                    let entity_find_index = missing_entity_type.findIndex(val => val === entity_entry.entity)
                    if (entity_find_index !== -1) {
                        entity_entry.from_context = true
                        entity_entry.alias = intent_stack[i].missing_entities[entity_find_index]
                        intent_stack[i].confirmed_entities.push(entity_entry)
                        intent_stack[i].missing_entities.splice(entity_find_index, 1)
                        intent_updated = true

                        //return so that this entity cant be reused for the remaining missing entity
                        return
                    }
                })

                // very funky bandaid here, saayyy if any intent is requiring a "phrase" entity, lets just parse the whole user sentence into said entity, LGTM!
                let phrase_entity_index = missing_entity_type.findIndex(val => val.includes("phrase"))
                if (phrase_entity_index !== -1) {
                    let phrase_entity = {
                        start: 0,
                        end: input.length - 1,
                        len: input.length,
                        accuracy: 1,
                        sourceText: input,
                        utteranceText: input,
                        entity: intent_stack[i].missing_entities[phrase_entity_index],
                        resolution: {
                            type: intent_stack[i].missing_entities[phrase_entity_index],
                            str: input,
                            value: input,
                        },
                        from_context: true,
                        alias: intent_stack[i].missing_entities[phrase_entity_index]
                    }
                    intent_stack[i].confirmed_entities.push(phrase_entity)
                    intent_stack[i].missing_entities.splice(phrase_entity_index, 1)
                    intent_updated = true
                }

                if (intent_updated) {
                    // if the closest to the stack have its entity updated, retry the intent with the new entities
                    let intent = intent_stack[i]
                    let intent_exec = IntentHandler.get(intent.intent)
                    context.intent_stack.splice(i, 1)
                    if (intent) {
                        if (!service_access_tier[intent.intent] || service_access_tier[intent.intent].includes(option.plan)) {
                            [response, context, action] = await intent_exec.run(intent.confirmed_entities, option, context, true)
                        }
                        else {
                            response = "Tài khoản của bạn chưa thể sử dụng chức năng này nhé"
                        }
                    }
                    else {
                        response = "Chức năng chưa được xây dựng"
                    }
                    break
                }
            }
        }
        while (context.intent_stack.length > 10) {
            context.intent_stack.shift()
        }
        resolve([response, context, action])
    })  
}