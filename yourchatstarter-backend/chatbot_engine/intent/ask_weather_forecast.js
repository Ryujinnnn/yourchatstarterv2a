const get_forecast = require('../../info_module/get_weather_forecast')
const { forecast_infographic } = require('../../info_module/infographic_generator')

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
                context_intent_entry.confirmed_entities.push(location_entity)
                let location = location_entity.option
                await get_forecast(location)
                    .then(
                    async (weather_res) => {
                        //console.log(weather_res)
                        response = `Dự báo thời tiết cho ${location} như sau`
                        await forecast_infographic(weather_res)
                            .then(
                            (data_uri) => {response += "\n![weather infographic](" + data_uri + ")"},
                            (e) => response += ``)
                    },
                    (e) => response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`)

            }
        }
        else {
            response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`
        }
        context.intent_stack.push(context_intent_entry)
        context.suggestion_list = ["Bản khỏe không", "Thời tiết ở TP.HCM như thế nào?", "Dự báo thời tiết TP Hồ Chí Minh", "thời tiết đà nẵng sắp tới", "cảm ơn"]
        resolve([response, context])
    })
}
module.exports.name = "ask_weather_forecast"

module.exports.isEnable = true