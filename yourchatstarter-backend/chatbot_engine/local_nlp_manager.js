const { NlpManager, ConversationContext } = require('node-nlp')
const fs = require('fs')
const context_handle = require('../chatbot_engine/context_handler')
const { embeded_answer } = require('../info_module/basic_answer_query')
const { customNER, cleanEntities } = require('./custom_ner')
const freeform_query = require('./freeform_query')
const { session_storage, smalltalk_suggestion, service_access_tier } = require('../database/session_storage')
const { get_sentiment } = require('./external_service/sentiment_analysist')
const { generate_text } = require('./external_service/generate_response')
const random_helper = require('./utils/random_helper')
const parse_reading = require('./utils/parse_number_reading')
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

            session_storage.falcon_available = true

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
        affirmation.addNewDictRule(["Hủy", "Không", "Từ chối", "hủy", "không", "từ chối"], "no", 0.9)

        
        let number_ner = new customNER("custom_number", "vi")
        number_ner.addNewRegexRule(/((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)/g, null, (inp) => {
            let val = 1
            try {
                val = parseFloat(inp.trim())
            }
            catch (e) {console.log('error parsing value')}
            return val
        })

        const start_word = `(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)`
        const word = `(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|lăm|mốt|tư|ngàn|nghìn|tỷ|tỉ|vạn|trăm|triệu|lẻ|không|mươi)`

        number_ner.addNewRegexRule(new RegExp(`${start_word}(\\s${word})*`, 'gi'), null, (inp) => {
            let val = 1
            try {
                val = parse_reading(inp)
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

        let custom_wiki_property_entity = new customNER('wiki_property_entity', 'vi')

        function add_property_alias(alias, value, type = 1, threshold = 1) {
            //type = -1 for prefix, 1 for suffix, 0 for both concat
            custom_wiki_property_entity.addNewDictRule(alias, 
            (prefix_val, match_str, suffix_val) => {
                let entity_val = ""
                try {
                    if (type === -1) entity_val = prefix_val.trim()
                    if (type === 1) entity_val = suffix_val.trim()
                    if (type === 0) entity_val = prefix_val.trim() + " " + suffix_val.trim()
                }
                catch (e) { console.log('error parsing suffix') }
                return {
                    property: value,
                    entity: entity_val
                }
            }, 1, /^.+\s+/g, /\s+.+\s*$/g)
        }

        add_property_alias(["ai sáng tác", "ai đã sáng tác"], "tác giả", 1, 0.9)
        add_property_alias(["ai là người sinh ra", "ai đã sinh"], "mẹ", 1, 0.9)
        add_property_alias(["sinh vào ngày nào", "sinh lúc nào", "sinh khi nào"], "ngày sinh", -1, 0.9)
        add_property_alias(["rộng bao nhiêu", "có diện tích bao nhiêu"], "diện tích", -1, 0.9)
        add_property_alias(["có dân số bao nhiêu", "có bao nhiêu dân"], "dân số", -1, 0.9)
        add_property_alias(["ai sáng lập", "ai đã thành lập", "ai đã sáng lập", "ai là người sáng lập", "ai thành lập"], "nhà sáng lập", 1, 0.9)

        let custom_conversion_unit = new customNER('conversion_unit', 'vi')

        custom_conversion_unit.addNewDictRule(['ký', 'kí'], 'kg', 1)
        custom_conversion_unit.addNewDictRule(['gam', 'g'], 'gram', 1)
        custom_conversion_unit.addNewDictRule(['Oát', 'W'], 'watt', 1)
        custom_conversion_unit.addNewDictRule(['thìa cà phê','muỗng cà phê'], 'teaspoon', 1)
        custom_conversion_unit.addNewDictRule(['thìa canh','muỗng canh'], 'tablespoon', 1)
        custom_conversion_unit.addNewDictRule(['foot'], 'foot', 1)

        custom_conversion_unit.addNewDictRule(['Pa'], 'pascal', 1)
        custom_conversion_unit.addNewDictRule(['ga lông'], 'gallon', 1)
        custom_conversion_unit.addNewDictRule(['mile','mi'], 'dặm', 1)
        custom_conversion_unit.addNewDictRule(["'"], 'foot', 1)
        custom_conversion_unit.addNewDictRule(['hải lý','dặm hải lý'], 'nautical mile', 1)


        custom_conversion_unit.addNewDictRule(['bar'], 'bar', 1)
        custom_conversion_unit.addNewDictRule(['cây'], 'km', 1)
        custom_conversion_unit.addNewDictRule(['mét','thước','m'], 'meter', 1)
        custom_conversion_unit.addNewDictRule(['phân','xăng'], 'centimeter', 1)
        custom_conversion_unit.addNewDictRule(['li','ly'], 'millimeter', 1)



        custom_conversion_unit.addNewDictRule(['ha'], 'hectare', 1)
        custom_conversion_unit.addNewDictRule(['atm'], 'atmosphere', 1)
        custom_conversion_unit.addNewDictRule(['K'], 'kelvin', 1)
        custom_conversion_unit.addNewDictRule(['C'], 'celsius', 1)
        custom_conversion_unit.addNewDictRule(['l','L','lít'], 'liter', 1)
        custom_conversion_unit.addNewDictRule(['mi li', 'ml', 'mL'], 'milliliter', 1)


        



        custom_conversion_unit.addNewDictRule(['b'], 'bit',1)
        custom_conversion_unit.addNewDictRule(['bai'], 'byte',1)

        custom_conversion_unit.addNewDictRule(['J'], 'joule',1)
        custom_conversion_unit.addNewDictRule(['mét'], 'm', 1)
        custom_conversion_unit.addNewDictRule(['N'], 'newton', 1)
        custom_conversion_unit.addNewDictRule(['sân'], 'yard', 1)
        custom_conversion_unit.addNewDictRule(['năm'], 'year', 1)
        custom_conversion_unit.addNewDictRule(['tháng'], 'month', 1)
        custom_conversion_unit.addNewDictRule(['ngày'], 'day', 1)
        custom_conversion_unit.addNewDictRule(['giây','s'], 'second', 1)
        custom_conversion_unit.addNewDictRule(['phút'], 'minute', 1)
        custom_conversion_unit.addNewDictRule(['giờ'], 'hour', 1)





        let custom_location = new customNER('location', 'vi')
        custom_location.addNewDictRule(['tp hồ chí minh', 'thành phố hồ chí minh', 'tp hcm', 'tp.hcm', 'tphcm', 'sài gòn'], "Thành phố Hồ Chí Minh", 0.9)

        custom_ner_pool = [
            date_vi, 
            affirmation, 
            number_ner, 
            interval_ner, 
            math_expr_ner, 
            custom_wiki_property_entity,
            custom_conversion_unit,
            custom_location,
        ]
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
                    let intent_name = res.intent.replace("service.", "")
                    let intent = IntentHandler.get(intent_name)
                    if (intent) {
                        if (!service_access_tier[intent_name] || service_access_tier[intent_name].includes(option.plan)) {
                            let entities = res.entities;
                            if (intent.name === "ask_entity_property") [answer, context] = await intent.run(entities, option, context, input, true)
                            else [answer, context, action] = await intent.run(entities, option, context, true)
                        }
                        else {
                            answer = "Tài khoản của bạn chưa thể sử dụng chức năng này nhé"
                        }
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
                        //TODO: the last resort, switching the conversation mode to using BARTpho model
                        if (session_storage.falcon_available && process.env.USE_BARTPHO) {
                            answer = await generate_text(input)
                            unknown_intent = false
                        }
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
                    if (session_storage.falcon_available && process.env.USE_BARTPHO) {
                        answer = await generate_text(input)
                    }
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