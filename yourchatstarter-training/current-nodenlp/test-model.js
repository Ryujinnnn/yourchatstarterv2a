const fs = require('fs');
const { NlpManager, ConversationContext} = require('node-nlp')
const { customNER } = require('./custom_ner')


async function trainnlp() {
    const options = { languages: ['vi']};
	const manager = new NlpManager(options);

    let nlp = manager.nlp

    if (fs.existsSync('./model.nlp')) {
        console.log("Language model found, loading model...")
        await manager.load('./model.nlp');

        // let res = await nlp.extractEntities("Thời tiết ở Đồng Hới như thế nào?")
        // console.log(res)
        
        let res = await nlp.process('liên bang nga')
        console.dir(res, {depth: null})
        
        // res = await nlp.process("22000 VND đổi ra bao nhiêu USD?")
        // console.dir(res, {depth: null})
        return;
    }

    // let date_vi = new customNER("date", "vi")
    // date_vi.addNewDictRule(["mai", "hôm sau"], new Date(new Date() + 1000 * 3600 * 24), 0.8)
    // date_vi.addNewDictRule(["hôm qua", "hôm trước"], new Date(new Date() - 1000 * 3600 * 24), 0.8)
    // date_vi.addNewDictRule(["hôm nay"], new Date(), 0.8)

    // date_vi.process("Ngày hôm qua tôi đi học, còn hôm nay tôi ở nhà")

    // let email = new customNER("email", "vi")
    // email.addNewRegexRule(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, null)
    // email.process("địa chỉ mail của tôi là neroyuki241@gmail.com, mail phụ của tôi là kingrfminecraft@gmail.com")
}

trainnlp()