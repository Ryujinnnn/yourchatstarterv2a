const { NlpManager, ConversationContext } = require('node-nlp')
const fs = require('fs')
const context_handle = require('../chatbot_engine/context_handler')
const { embeded_answer } = require('../info_module/basic_answer_query')
const { customNER, cleanEntities } = require('./custom_ner')
const freeform_query = require('./freeform_query')
const { session_storage, smalltalk_suggestion } = require('../database/session_storage')
const { get_sentiment } = require('./external_service/sentiment_analysist')
const random_helper = require('./utils/random_helper')
const { LangBert } = require('@nlpjs/lang-bert')
const { default: axios } = require('axios')

//https://vimeo.com/574939993?fbclid=IwAR0nH8OmzFXwHz8dVTNPHvXMkEHUv1mGaFSGcEUoRol6zu2hRYqIAT19XCI

let manager = null
let nlp = null
let context = null
let custom_ner_pool = []

const negative_sentiment_response_pool = [
    ". Mình xin lỗi nếu mình có làm bạn tức giận",
    ". Mình mong bạn kiềm chế",
    ". Mong bạn đừng nóng nhé",
]

const negative_unclear_response_pool = [
    "Mình không chắc bạn muốn làm gì nhưng mà đừng nóng bạn nhé",
    "Mình không rõ ý bạn là gì nhưng mong bạn đừng nóng",
    "Mình xin lỗi bạn, mình không hiểu ý bạn cho lắm"
]

const positive_sentiment_response_pool = [
    ". Mình mừng vì bạn thấy vui",
    ". Cảm ơn bạn đã tin tưởng tôi",
    ". Mình mong rằng mình đã làm bạn hài lòng"
]

const positive_unclear_response_pool = [
    "Mình không rõ là bạn muốn nói gì lắm, nhưng bạn có vẻ đang cảm thấy vui, mình cũng thấy vui cho bạn",
    "Mình không hiểu ý bạn lắm, nhưng bạn có vẻ rất vui",
    "Mình chưa chắc là mình hiểu bạn muốn nói gì, nhưng mình mừng vì bạn thấy vui"
]

const embeded_suggestion = {
    "embeded.ask_time": ["Hiện tại là ngày mấy", "Hôm nay là thứ mấy", "Cảm ơn", "Bạn thật tuyệt"],
    "embeded.ask_date": ["Hiện tại đang là mấy giờ", "Hôm nay là thứ mấy", "Cảm ơn", "Bạn thật tuyệt"],
    "embeded.ask_day_of_week": ["Hôm nay là ngày mấy", "Bây giờ là mấy giờ", "Cảm ơn", "Bạn thật tuyệt"],
}

const freeform_query_suggestion = [
    "Vinamilk", "Đồng Hới", "Thủ đô của Việt Nam", "COVID-19", "Huấn luyện viên trưởng của Manchester City", "J.K.Rowling", "Sea Games 31"
]

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

    if (fs.existsSync('./chatbot_engine/model.nlp') || fs.existsSync('./chatbot_engine/model-bert.nlp')) {
        console.log('found model file, importing...')
        //try to ping python server
        let try_python = await fetch('http://localhost:8000/ping').catch(e => console.log('connection error in python server instance'))
        if (try_python && try_python.status == 200) {
            console.log('python server found, using bert tokenizer')
            manager.container.registerConfiguration('bert', {
                url: 'http://localhost:8000/tokenize',
                languages: ['vi']
            });
            manager.container.use(LangBert);

            const data = fs.readFileSync('./chatbot_engine/model-bert.nlp', {encoding: 'utf-8'});
            manager.import(data);
        }
        else {
            console.log('python server not found, fallback to default tokenizer')
            const data = fs.readFileSync('./chatbot_engine/model.nlp', {encoding: 'utf-8'});
            manager.import(data);
        }
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
        affirmation.addNewDictRule(['Đồng ý', 'đồng ý', 'đồng Ý', 'Chắc chắn', 'Đúng', 'Xác nhận', "oke", "ok", "okay"], "yes", 0.9)
        affirmation.addNewDictRule(["Hủy", "Không", "Từ chối"], "no", 0.9)

        
        let number_ner = new customNER("custom_number", "vi")
        number_ner.addNewRegexRule(/((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)/g, null, (inp) => {
            let val = 1
            try {
                val = parseFloat(inp.trim())
            }
            catch (e) {console.log('error parsing value')}
            return val
        })

        let math_expr_ner = new customNER("math_expr", "vi")
        math_expr_ner.addNewRegexRule(/([\d\(\+\-]|sin|cos|tan|abs|pow)([\s\d\(\)\+\-\*\/\.]|sin|cos|tan|abs|pow)+([\d\)])/g)

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

        custom_ner_pool = [date_vi, affirmation, number_ner, interval_ner, math_expr_ner]
        console.log('custom NER is loaded')

        return true;
    }
    else {
        console.log("WARNING: no model is found")
        return false;
    }
}

Array.prototype.slice_wrap = function (start, end) {
    if (start <= end) {
        return this.slice(start, end)
    }
    else {
        return this.slice(start).concat(this.slice(0, end))
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
            //sentiment analysis here
            let sentiment_res = await get_sentiment(input).catch(e => console.log(e))

            //clean entities list
            res.entities = cleanEntities(res.entities)

            console.log(res)
            let answer = ""
            let action = {}
            let unknown_intent = false
            if (res) {
                //TODO: match against specifically made intent first, if none is found, return answer from the trained data
                //console.log(res)

                // try to process pending context

                [answer, context, action] = await context_handle(res, input, option, context, IntentHandler).catch((err) => { console.log(err); answer = "" })

                if (answer !== "") {
                    resolve([answer, context, action])
                    return
                }

                if (res.intent.startsWith("service.") && res.score > 0.7) {
                    //restructure entity
                    session_storage.defined_intent += 1
                    let intent = IntentHandler.get(res.intent.replace("service.", ""))
                    if (intent) {
                        let entities = res.entities;
                        if (intent.name === "ask_entity_property") [answer, context] = await intent.run(entities, option, context, input, true)
                        else [answer, context, action] = await intent.run(entities, option, context, true)
                    }
                    else {
                        answer = "Chức năng chưa được xây dựng"
                    }

                }
                else if (res.intent.startsWith('embeded.') && res.score > 0.7) {
                    session_storage.defined_intent += 1
                    answer = embeded_answer(res.intent, res.answer)
                    context.suggestion_list = embeded_suggestion[res.intent] || ['Chào bạn', 'Mình phải đi đây', "Bạn thích làm gì lúc rảnh", "Bạn thật tuyệt"]
                }
                else if (res.intent === "None" || res.score <= 0.7) {

                    // if context failed to be resolved, try freeform query
                    console.log('fail to resolve any context, try freeform query')
                    //console.log([answer, context])
                    answer = await freeform_query(context, input, res)

                    // at this point the bot gives up
                    if (answer == "") {
                        session_storage.unknown_intent += 1
                        unknown_intent = true
                        answer = res.answer
                        let start_index = random_helper(smalltalk_suggestion.length)
                        context.suggestion_list = ["Trợ giúp", "Giúp mình với"].concat(smalltalk_suggestion.slice_wrap(start_index, (start_index + 2) % smalltalk_suggestion.length))
                    }
                    else {
                        let start_index = random_helper(freeform_query_suggestion.length)
                        //let start_index = freeform_query_suggestion.length - 1
                        session_storage.freeform_search += 1
                        context.suggestion_list = ["Cảm ơn"].concat(freeform_query_suggestion.slice_wrap(start_index, (start_index + 3) % freeform_query_suggestion.length))
                    }
                    //console.log(answer)
                }
                else {
                    session_storage.defined_intent += 1
                    answer = res.answer
                    let start_index = random_helper(smalltalk_suggestion.length)
                    context.suggestion_list = smalltalk_suggestion.slice_wrap(start_index, (start_index + 4) % smalltalk_suggestion.length)
                }

                if (sentiment_res && sentiment_res.certainty > 70) {
                    if (sentiment_res.intent === "negative") {
                        session_storage.negative_utterance += 1
                        if (unknown_intent) answer = negative_unclear_response_pool[random_helper(negative_unclear_response_pool.length)]
                        else if (Math.random() > 0.25) answer += negative_sentiment_response_pool[random_helper(negative_sentiment_response_pool.length)]
                    }
                    else if (sentiment_res.intent === "positive") {
                        session_storage.positive_utterance += 1
                        if (unknown_intent) answer = positive_unclear_response_pool[random_helper(positive_unclear_response_pool.length)]
                        else if (Math.random() > 0.8) answer += positive_sentiment_response_pool[random_helper(positive_sentiment_response_pool.length)]
                    }
                    else if (sentiment_res.intent === "neutral") {
                        session_storage.neutral_utterance += 1
                    }
                }

                resolve([answer, context, action])
                return
            }
        }
        reject("Error from node-nlp process")
    })
}