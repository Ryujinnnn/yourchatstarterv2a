const nominating_search = require("../../info_module/map_api")

module.exports.run = (entities, option, context, isLocal = true) => {
    return new Promise(async (resolve, reject) => {
        let response = ""

        let action = {}

        let context_intent_entry = {
            intent: this.name,
            addition_entities: [],
            confirmed_entities: [],
            missing_entities: []
        }

        if (isLocal) {
            let location_entity = entities.find((val) => val.entity === "location_phrase")
            if (!location_entity) {
                response = "Bạn có thể cho mình biết tên địa điểm được không?"
                context.suggestion_list = ['Hà Nội', 'Landmark 81', 'Trường đại học nông lâm']
                context_intent_entry.missing_entities.push("location_phrase")
            }
            else {
                let location = location_entity.sourceText
                let location_info = await nominating_search(location).catch(e => console.log(e))
                if (!location_info) {
                    response = "Mình không thể tìm được nó ở đâu cả. Xin lỗi bạn :("
                }
                else {
                    action = {
                        action: "SHOW_MAP",
                        data: {
                            message: `${location_info.lat} ${location_info.lon}`, 
                            time: new Date(),
                            type: 'one-time'
                        }
                    }
                    response = `Mình đã tìm thấy ${location}`
                }
                context.suggestion_list = ['Vincom Đồng Khởi ở đâu?', 'Tam Kỳ ở đâu?', 'Trường đại học bách khoa thành phố hồ chí minh ở đâu', "Cảm ơn"]
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, action])
    })
}

module.exports.name = "ask_location"

module.exports.isEnable = true