//const get_exchange = require('../../info_module/__________________')

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (!entities['wit$location:location']) {
        }
        else {
            let location = entities['wit$location:location'][0].value
    
            // await _________
        }
        resolve([response, context])
    })
}

module.exports.name = "ask_covid"
module.exports.isEnable = true