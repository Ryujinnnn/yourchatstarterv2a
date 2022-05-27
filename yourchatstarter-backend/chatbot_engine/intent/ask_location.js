const nominating_search = require("../../info_module/map_api")

module.exports.run = (entities, option, context, isLocal = true) => {
    return new Promise(async (resolve, reject) => {
        let response = ""

        let action = {}

        if (isLocal) {
            let location_entity = entities.find((val) => val.entity === "location_prompt")
            if (!location_entity) {
                response = "Mình không thể tìm được nó ở đâu cả. Xin lỗi bạn :("
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
                context.suggestion_list = ['Vincom Đồng Khởi ở đâu?', 'Tam Kỳ ở đâu?', 'Đại học bách khoa thành phố hồ chí minh ở đâu', "Cảm ơn"]
            }
        }

        resolve([response, context, action])
    })
}

module.exports.name = "ask_location"

module.exports.isEnable = true