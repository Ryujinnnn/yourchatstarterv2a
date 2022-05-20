const { NlpManager, ConversationContext } = require('node-nlp')
const fs = require('fs')
const context_handle = require('../chatbot_engine/context_handler')
const { embeded_answer } = require('../info_module/basic_answer_query')
const { customNER, cleanEntities } = require('./custom_ner')
const freeform_query = require('./freeform_query')
const { session_storage } = require('../database/session_storage')
const { get_sentiment } = require('./external_service/sentiment_analysist')

//https://vimeo.com/574939993?fbclid=IwAR0nH8OmzFXwHz8dVTNPHvXMkEHUv1mGaFSGcEUoRol6zu2hRYqIAT19XCI

let manager = null
let nlp = null
let context = null
let custom_ner_pool = []

module.exports.setupInstance = async () => {
    const options = {
        languages: ['vi'], nlu: { useNoneFeature: true }, ner: {
            useDuckling: false, allowList: [
                'age',
                'dimension',
                'temperature',
                'number',
                'numberrange',
                'ordinal',
                'percentage',
                'email',
                'hashtag',
                'ip',
                'mention',
                'phonenumber',
                'url',
                'date',
                'daterange',
                'datetime',
                'datetimealt',
                'time',
                'set',
                'timerange',
                'timezone',
                'boolean',
                'duration',
                'datetimerange']
        }
    };
    manager = new NlpManager(options);
    nlp = manager.nlp
    context = new ConversationContext()

    if (fs.existsSync('./chatbot_engine/model.nlp')) {
        console.log('found model file, importing...')
        const data = fs.readFileSync('./chatbot_engine/model.nlp', 'utf8');
        manager.import(data);
        console.log('model is loaded')

        console.log('initializing custom NER')

        let date_vi = new customNER("date", "vi")
        date_vi.addNewDictRule(["mai", "hôm sau"], new Date(new Date().valueOf() + 1000 * 3600 * 24), 0.8)
        date_vi.addNewDictRule(["hôm qua", "hôm trước"], new Date(new Date().valueOf() - 1000 * 3600 * 24), 0.8)
        date_vi.addNewDictRule(["hôm nay"], new Date(), 0.8)


        date_vi.addNewDictRule(["giờ nữa", "giờ sau", "tiếng nữa", "tiếng sau", "h nữa", "h sau", "g nữa", "g sau"],
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) { console.log('error parsing prefix') }
                return new Date(new Date().valueOf() + 1000 * 3600 * val)
            }, 1, /\s+\d+\s*$/g, null
        )

        date_vi.addNewDictRule(["phút nữa", "phút sau", "ph nữa", "ph sau"],
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) { console.log('error parsing prefix') }
                return new Date(new Date().valueOf() + 1000 * 60 * val)
            }, 1, /\s+\d+\s*$/g, null
        )

        date_vi.addNewDictRule(["ngày sau"],
            (prefix_val, match_str, suffix_val) => {
                let val = 1
                try {
                    val = parseFloat(prefix_val)
                }
                catch (e) { console.log('error parsing prefix') }
                return new Date(new Date().valueOf() + 1000 * 3600 * 24 * val)
            }, 1, /\s+\d+\s*$/g, null
        )

        let affirmation = new customNER("affirmation", "vi")
        affirmation.addNewDictRule(['Đồng ý', 'Chắc chắn', 'Đúng', 'Xác nhận', "oke", "ok", "okay"], "yes", 0.9)
        affirmation.addNewDictRule(["Hủy", "Không", "Từ chối"], "no", 0.9)

        
        let number_ner = new customNER("custom_number", "vi")
        number_ner.addNewRegexRule(/(^\d+(?=\s))|(\s\d+(?=\s))|(\s\d+$)|(^\d+$)/g, null, (inp) => {
            let val = 1
            try {
                val = parseFloat(inp.trim())
            }
            catch (e) {console.log('error parsing value')}
            return val
        })

        let interval_ner = new customNER("interval", "vi")
        interval_ner.addNewDictRule(["mỗi ngày"], 
            {
                start_time: new Date().valueOf(),
                interval: 24 * 3600 * 1000
            }
        )
        
        interval_ner.addNewDictRule(["mỗi giờ"], 
            {
                start_time: new Date().valueOf(),
                interval: 3600 * 1000
            }
        )
    
        interval_ner.addNewDictRule(["mỗi tuần"], 
            {
                start_time: new Date().valueOf(),
                interval: 7 * 24 * 3600 * 1000
            }
        )

        custom_ner_pool = [date_vi, affirmation, number_ner, interval_ner]
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
            session_storage.message_receive += 1

            let res = await nlp.process('vi', input)
            custom_ner_pool.forEach(instance => {
                res.entities = res.entities.concat(instance.process(input))
            })
            // let sentiment_res = await get_sentiment(input).catch(e => console.log(e))
            // if (sentiment_res) {
            //     console.log(sentiment_res)
            // }
            res.entities = cleanEntities(res.entities)

            //TODO: sentiment analysis here
            //get_sentiment(input)

            console.log(res)
            let answer = ""
            let action = {}
            if (res) {
                //TODO: match against specifically made intent first, if none is found, return answer from the trained data
                //console.log(res)
                if (res.intent.startsWith("service.") && res.score > 0.7) {
                    //restructure entity
                    session_storage.defined_intent += 1
                    let intent = IntentHandler.get(res.intent.replace("service.", ""))
                    if (intent) {
                        let entities = res.entities;
                        if (intent.name === "ask_calc") [answer, context, action] = await intent.run(entities, option, context, input, true)
                        else if (intent.name === "ask_entity_property") [answer, context] = await intent.run(entities, option, context, input, true)
                        else [answer, context, action] = await intent.run(entities, option, context, true)
                    }
                    else {
                        answer = "Chức năng chưa được xây dựng"
                    }

                }
                else if (res.intent.startsWith('embeded.') && res.score > 0.7) {
                    session_storage.defined_intent += 1
                    answer = embeded_answer(res.intent, res.answer)
                    context.suggestion_list = ['Chào bạn', 'Mình phải đi đây', "Bạn thích làm gì lúc rảnh", "Bạn thật tuyệt"]
                }
                else if (res.intent === "None" || res.score <= 0.7) {
                    // try to process pending context

                    [answer, context, action] = await context_handle(res, input, option, context, IntentHandler).catch((err) => { console.log(err); answer = "" })

                    // if context failed to be resolved, try freeform query

                    if (answer == "") {
                        session_storage.freeform_search += 1
                        console.log('fail to resolve any context, try freeform query')
                        //console.log([answer, context])
                        answer = await freeform_query(context, input, res)
                        if (!answer) {
                            session_storage.unknown_intent += 1
                            answer = res.answer
                        }
                        //console.log(answer)
                    }
                    else {
                        session_storage.slot_filling += 1
                    }
                }
                else {
                    session_storage.defined_intent += 1
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