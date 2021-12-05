const get_weather = require('../../info_module/get_weather')

module.exports.run = (entities, option, context, isLocal = false) => {
    return new Promise(async (resolve, reject) => {
        let response = ""

        let context_intent_entry = {
            intent: this.name,
            addition_entities: [],
            confirmed_entities: [],
            missing_entities: []
        }

        if (isLocal) {  
            let location_entity = entities.find((val) => val.entity === "location")
            if (!location_entity) {
                response = "Bạn có thể nói rõ thời tiết ở đâu được không?"
                context_intent_entry.missing_entities.push('location')
            }
            else {
                let location = location_entity.option
                await get_weather(location)
                    .then(
                    (weather_res) => {response = `Hiện tại ở ${location} trời đang ${weather_res.desc}, nhiệt độ khoảng ${weather_res.temp.toFixed(2)} độ C`},
                    (e) => response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`)
            }
        }
        else {
            if (!entities['wit$location:location']) {
                response = "Bạn có thể nói rõ thời tiết ở đâu được không?"
                context_intent_entry.missing_entities.push('location')
            }
            else {
                console.log("fetching weather")
                let location = entities['wit$location:location'][0].body
                await get_weather(location)
                    .then(
                    (weather_res) => {response = `Hiện tại ở ${location} trời đang ${weather_res.desc}, nhiệt độ khoảng ${weather_res.temp.toFixed(2)} độ C`},
                    (e) => response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`)
            }
        }
        context.intent_stack.push(context_intent_entry)
        context.suggestion_list = ["Bản khỏe không", "Thời tiết ở TP.HCM như thế nào?"]
        resolve([response, context])
    })
}

module.exports.name = "ask_weather"
module.exports.isEnable = true