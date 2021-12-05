const { NlpManager, ConversationContext} = require('node-nlp')
const fs = require('fs') 
const { wiki_query } = require('../info_module/wikidata_info')
const { get_knowledge } = require('../info_module/google_info/get_knowledge')
const context_handle = require('../chatbot_engine/context_handler')

//https://vimeo.com/574939993?fbclid=IwAR0nH8OmzFXwHz8dVTNPHvXMkEHUv1mGaFSGcEUoRol6zu2hRYqIAT19XCI

let manager = null
let nlp = null
let context = null

module.exports.setupInstance = async () => {
    const options = { languages: ['vi'], nlu: { useNoneFeature: true } };
	manager = new NlpManager(options);
	nlp = manager.nlp
    context = new ConversationContext()

    if (fs.existsSync('./chatbot_engine/model.nlp')) {
        console.log('found model file, importing...')
        const data = fs.readFileSync('./chatbot_engine/model.nlp', 'utf8');
        manager.import(data);
        console.log('model is loaded')
        return true;
    }
    else {
        console.log("WARNING: no model is found")
        return false;
    }
}

module.exports.processInput = (input, option = {}, context = {}, IntentHandler) => {
    return new Promise(async (resolve, reject) => {
        console.log(input)
        if (!input || input.length < 1) {
            let answer = "Tin nhắn của bạn quá ngắn, hãy gõ thêm gì đó vào nhé =)"
            resolve([answer, context])
            return
        }
        else if (input.length > 270) {
            let answer = "Tin nhắn của bạn quá dài, hãy cố gõ dưới 270 kí tự thôi nhé =)"
            resolve([answer, context])
            return
        }
        else {
            let res = await nlp.process('vi', input)
            let answer = ""
            if (res) {
                //TODO: match against specifically made intent first, if none is found, return answer from the trained data
                console.log(res)
                if (res.intent.startsWith("service.")) {
                    //restructure entity
                    let intent = IntentHandler.get(res.intent.replace("service.", ""))
                    if (intent) {
                        let entities = res.entities;
                        if (intent.name === "ask_calc") [answer, context] = await intent.run(entities, option, context, input, true)
                        else [answer, context] = await intent.run(entities, option, context, true)
                    }
                    else {
                        answer = "Chức năng chưa được xây dựng"
                    }
                
                }
                else if (res.intent === "None") {

                    // try to process pending context

                    [answer, context] = await context_handle(res, input, option, context, IntentHandler)

                    if (answer == "") {
                        //if context failed to get anything out, fallback to google search prompt
                       
                        await get_knowledge(input).then(async google_res => {
                            //TODO: GKG result is pretty fucking bad, might need to do a strict match for GKG result before fallback to wiki
                            if (!google_res.itemListElement || google_res.itemListElement.length === 0) {
                                //if no google knowledge graph is found, use wikipedia for prompt
                                await wiki_query(input).then(wiki_res => {
                                    answer = wiki_res[0].label + " là " + wiki_res[0].description
                                })
                            }
                            else {
                                first_res = google_res.itemListElement[0]
                                if (first_res.result.detailedDescription) {
                                    answer = first_res.result.detailedDescription.articleBody
                                }
                                else {
                                    answer = `${first_res.result.name} là ${first_res.result.description}`
                                }
                            }
                        })
                        .catch((e) => {
                            console.log(e)
                            answer = res.answer
                        })
                    }
                }
                else {
                    answer = res.answer
                }
                resolve([answer, context])
                return
            }
        }
        reject("Error from node-nlp process")
    })
}