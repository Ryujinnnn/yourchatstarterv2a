const { NlpManager, ConversationContext} = require('node-nlp')
const fs = require('fs') 

//https://vimeo.com/574939993?fbclid=IwAR0nH8OmzFXwHz8dVTNPHvXMkEHUv1mGaFSGcEUoRol6zu2hRYqIAT19XCI

let manager = null
let nlp = null
let context = null

module.exports.setupInstance = async () => {
    const options = { languages: ['vi']};
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

module.exports.processInput = (input) => {
    return new Promise(async (resolve, reject) => {
        console.log(input)
        let res = await nlp.process('vi', input)
        let answer = ""
        if (res) {
            //TODO: match against specifically made intent first, if none is found, return answer from the trained data

            answer = res.answer
            resolve(answer)
        }
        reject("Error from node-nlp process")
    })
}