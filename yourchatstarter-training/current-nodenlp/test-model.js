const fs = require('fs');
const { NlpManager, ConversationContext} = require('node-nlp')
const { customNER } = require('./custom_ner')


async function trainnlp() {
    const options = { languages: ['vi'],  ner: { useDuckling: false, allowList: ['age',
    'dimension',
    'temperature',
    //'numberrange',
    //'ordinal',
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
    'datetimerange'] }};
	const manager = new NlpManager(options);

    let nlp = manager.nlp

    //loading custom ner

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

    let phrase_ner = new customNER("phrase", "vi")
    phrase_ner.addNewRegexRule(/"[^"]+"/g)

    let number_ner = new customNER("custom_number", "vi")
    number_ner.addNewRegexRule(/\d+(?=\s)/g, null, inp => {
        let val = 1
        try {
            val = parseFloat(inp)
        }
        catch (e) {console.log('error parsing prefix')}
        return val
    })

    let affirmation = new customNER("affirmation", "vi")
    affirmation.addNewDictRule(['Đồng ý', 'Chắc chắn', 'Đúng', 'Xác nhận'], true, 1)
    affirmation.addNewDictRule(["Hủy", "Không", "Từ chối"], false, 1)
    
    // console.log(date_vi.process("Ngày hôm qua tôi đi học, hôm sau tôi sẽ tới nhà người thân"))
    // console.log(date_vi.process("Nhắc tôi làm việc trong 3h nữa"))
    // console.log(date_vi.process("Nhắc tôi làm việc 7 ngày sau"))
    // console.log(date_vi.process("Nhắc tôi ăn cơm sau 30ph nữa"))

    // let email = new customNER("email", "vi")
    // email.addNewRegexRule(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, null)

    if (fs.existsSync('./model.nlp')) {
        console.log("Language model found, loading model...")
        await manager.load('./model.nlp');

        // let res = await nlp.extractEntities("Thời tiết ở Đồng Hới như thế nào?")
        // console.log(res)
        
        // let res = await nlp.process('Ngày hôm qua tôi đi học, hôm sau tôi sẽ tới nhà người thân')
        // res.entities = res.entities.concat(date_vi.process('Ngày hôm qua tôi đi học, hôm sau tôi sẽ tới nhà người thân'))
        // console.dir(res, {depth: null})

        // console.log(phrase_ner.process("Nhắc tôi \"Học bài\" sau 3 giờ"))
        //let res = await nlp.process('1 gram đổi ra bao nhiêu kg')
        let res = await nlp.process('1 bạt thái đổi ra bao nhiêu việt nam đồng')
        res.entities = res.entities.concat(number_ner.process('1 bạt thái đổi ra bao nhiêu việt nam đồng'))
        console.dir(res, {depth: null})

        // res = await nlp.process("22000 VND đổi ra bao nhiêu USD?")
        // console.dir(res, {depth: null})
        return;
    }
    // email.process("địa chỉ mail của tôi là neroyuki241@gmail.com, mail phụ của tôi là kingrfminecraft@gmail.com")

    
}

trainnlp()