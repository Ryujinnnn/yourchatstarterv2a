const { wiki_property } = require('../../info_module/wikidata_info')

module.exports.run = (entities, option, context, input = "", isLocal = false) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (input.split('của').length >= 2) {
            //attempt for property parsing query
            let comp = input.split('của')
            let property = comp[0].trim()
            let object_entity = comp[1].trim()

            await wiki_property(property, object_entity).then(wiki_res => {
                if (wiki_res === "") {
                    response = 'Mình không rõ bạn muốn hỏi gì :('
                    return
                }
                response = `${property} của ${object_entity} là ${wiki_res}`
                context.suggestion_list = ['Vinamilk', 'Đồng Hới', "Covid-19"]
            }, (reason) => {
                console.log(reason)
                response = 'Mình không thể tìm được thông tin này'
            }).catch((e) => {
                console.log(e)
                response = 'Mình nghĩ là mình không thể nhớ ra. Bạn có thể hỏi lại sau được không?'
            })
        }
        else {
            response = 'Mình không rõ bạn muốn hỏi gì :('
        }
        console.log(response)
        resolve([response, context])
    })
}

module.exports.name = "ask_entity_property"

module.exports.isEnable = true