const get_weather = require('../../info_module/get_weather')

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        let context_entry = {
            intent: "ask_weather",
            modifier: [],
            sentiment: []
        }
        if (!entities['wit$location:location']) {
            response = "Bạn có thể nói rõ thời tiết ở đâu được không?"
            context_entry.modifier.push("-location")
        }
        else {
            console.log("fetching weather")
            let location = entities['wit$location:location'][0].body
            await get_weather(location)
                .then(
                (weather_res) => {response = `Hiện tại ở ${location} trời đang ${weather_res.desc}, nhiệt độ khoảng ${weather_res.temp.toFixed(2)} độ C`},
                (e) => response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`)
        }
        context.context_stack.push(context_entry)
        resolve([response, context])
    })
}

module.exports.name = "ask_weather"
module.exports.isEnable = true