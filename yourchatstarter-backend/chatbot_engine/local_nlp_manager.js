const { NlpManager, ConversationContext} = require('node-nlp')
const fs = require('fs') 
const { wiki_query } = require('../info_module/wikidata_info')
const { get_knowledge } = require('../info_module/google_info/get_knowledge')
const context_handle = require('../chatbot_engine/context_handler')
const { customNER } = require('./custom_ner')
const { Language } = require('@nlpjs/language');

//https://vimeo.com/574939993?fbclid=IwAR0nH8OmzFXwHz8dVTNPHvXMkEHUv1mGaFSGcEUoRol6zu2hRYqIAT19XCI

let manager = null
let nlp = null
let context = null
let date_vi = null
let affirmation = null

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

        console.log('initializing custom NER')

        date_vi = new customNER("date", "vi")
        date_vi.addNewDictRule(["mai", "hôm sau"], new Date(new Date().valueOf() + 1000 * 3600 * 24), 0.8)
        date_vi.addNewDictRule(["hôm qua", "hôm trước"], new Date(new Date().valueOf() - 1000 * 3600 * 24), 0.8)
        date_vi.addNewDictRule(["hôm nay"], new Date(), 0.8)
    
    
        date_vi.addNewDictRule(["giờ nữa", "giờ sau", "tiếng nữa", "tiếng sau", "h nữa", "h sau", "g nữa", "g sau"], 
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) {console.log('error parsing prefix')}
                return new Date(new Date().valueOf() + 1000 * 3600 * val)
            }, 1, /\s+\d+\s*$/g, null
        )
    
        date_vi.addNewDictRule(["phút nữa", "phút sau", "ph nữa", "ph sau"], 
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) {console.log('error parsing prefix')}
                return new Date(new Date().valueOf() + 1000 * 60 * val)
            }, 1, /\s+\d+\s*$/g, null
        )
    
        date_vi.addNewDictRule(["ngày sau"], 
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) {console.log('error parsing prefix')}
                return new Date(new Date().valueOf() + 1000 * 3600 * 24 * val)
            }, 1, /\s+\d+\s*$/g, null
        )
        
        affirmation = new customNER("affirmation", "vi")
        affirmation.addNewDictRule(['Đồng ý', 'Chắc chắn', 'Đúng', 'Xác nhận', "oke", "ok", "okay"], "yes", 0.9)
        affirmation.addNewDictRule(["Hủy", "Không", "Từ chối"], "no", 0.9)

        console.log('custom NER is loaded')
        

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
            resolve([answer, context, {}])
            return
        }
        else if (input.length > 270) {
            let answer = "Tin nhắn của bạn quá dài, hãy cố gõ dưới 270 kí tự thôi nhé =)"
            resolve([answer, context, {}])
            return
        }
        else {
            let res = await nlp.process('vi', input)
            res.entities = res.entities.concat(date_vi.process(input))
            res.entities = res.entities.concat(affirmation.process(input))

            //TODO: sentiment analysis here
            //get_sentiment(input)

            //console.log(res)
            let answer = ""
            let action = {}
            if (res) {
                //TODO: match against specifically made intent first, if none is found, return answer from the trained data
                console.log(res)
                if (res.intent.startsWith("service.") && res.score > 0.7) {
                    //restructure entity
                    let intent = IntentHandler.get(res.intent.replace("service.", ""))
                    if (intent) {
                        let entities = res.entities;
                        if (intent.name === "ask_calc") [answer, context, action] = await intent.run(entities, option, context, input, true)
                        else [answer, context, action] = await intent.run(entities, option, context, true)
                    }
                    else {
                        answer = "Chức năng chưa được xây dựng"
                    }
                
                }
                else if (res.intent === "None" || res.score <= 0.7) {

                    // try to process pending context

                    [answer, context, action] = await context_handle(res, input, option, context, IntentHandler).catch((err) => {console.log(err); answer = ""})

                    if (answer == "") {
                        let vn_desc_not_found = false
                        //if context failed to get anything out, fallback to a wiki search
                        console.log("context cant be resolve, attempting wiki")
                        await wiki_query(input).then(wiki_res => {
                            if (!wiki_res || wiki_res.length === 0) {
                                vn_desc_not_found = true
                                return
                            }
                            let lang = new Language().guessBest(wiki_res[0].description).alpha3 !== "vie"
                            if (lang) {
                                //wikidata have a tendency to return non-vietnamese result despite forcing it to, check the desc to see if its in vietnamese or not
                                vn_desc_not_found = true
                            }
                            answer = wiki_res[0].label + " là " + wiki_res[0].description
                            context.suggestion_list = ['Vinamilk', 'Đồng Hới', "Covid-19"]
                        }, (reason) => {
                            console.log(reason)
                            vn_desc_not_found = true
                        }).catch((e) => {
                            console.log(e)
                            vn_desc_not_found = true
                        })

                        //wikidata result is more reliable but in case it goes wack, fallback to google knowledge graph search (GKG)
                        if (vn_desc_not_found) {
                            console.log("wii res not found, finding in GKG")
                            await get_knowledge(input).then(async google_res => {
                                //TODO: GKG result is pretty fucking bad, might need to do a strict or fuzzy match for GKG result
                                //console.dir(google_res, {depth: null})

                                //google_res.itemListElement[0].result.name
                                if (!google_res.itemListElement || google_res.itemListElement.length === 0) {
                                    throw new Error("no google result")
                                }
                                else {
                                    first_res = google_res.itemListElement[0]
                                    if (first_res.result.detailedDescription) {
                                        answer = first_res.result.detailedDescription.articleBody
                                    }
                                    else {
                                        answer = `${first_res.result.name} là ${first_res.result.description}`
                                    }
                                    context.suggestion_list = ['Việt Nam', 'Taylor Swift', "Petrolimex"]
                                }
                            })
                            .catch((e) => {
                                console.log(e)
                                answer = res.answer
                            })
                        }
                    }
                }
                else {
                    answer = res.answer
                    context.suggestion_list = ['Chào bạn', 'Mình phải đi đây', "Bạn thích làm gì lúc rảnh", "Bạn thật tuyệt"]
                }
                resolve([answer, context, action])
                return
            }
        }
        reject("Error from node-nlp process")
    })
}