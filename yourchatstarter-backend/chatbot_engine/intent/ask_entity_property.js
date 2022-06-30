const { wiki_property } = require('../../info_module/wikidata_info')

module.exports.run = (entities, option, context, input = "", isLocal = false) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        let property = ""
        let object_entity = ""
        let wiki_prompt_entity = entities.find((val) => val.entity === "wiki_property_entity")

        if (wiki_prompt_entity) {
            property = wiki_prompt_entity.resolution.value.property
            object_entity = wiki_prompt_entity.resolution.value.entity
        }
        if (input.split('của').length >= 2) {
            //attempt for property parsing query
            let comp = input.split('của')
            property = comp[0].trim()
            object_entity = comp[1].trim()
        }

        if (property !== "" && object_entity !== "") {
            await wiki_property(property, object_entity).then(wiki_res => {
                if (wiki_res === "") {
                    response = 'Mình không rõ bạn muốn hỏi gì :('
                    return
                }
                response = `${property} của ${object_entity} là ${wiki_res}`
            }, (reason) => {
                console.log(reason)
                response = 'Mình không thể tìm được thông tin này'
            }).catch((e) => {
                console.log(e)
                response = 'Mình nghĩ là mình không thể nhớ ra. Bạn có thể hỏi lại sau được không?'
            })

            context.suggestion_list = ['Thủ đô của Canada', 'Ngày sinh của Nguyễn Ái Quốc', "Diện tích của Việt Nam", "Cảm ơn"]
        }
        else {
            response = 'Mình không rõ bạn muốn hỏi gì :('
            context.suggestion_list = ['Thủ đô của Hoa Kỳ', 'Dân số của Trung Quốc', "Địa chỉ của đài truyền hình việt nam", "Cảm ơn"]
        }
        console.log(response)
        resolve([response, context])
    })
}

module.exports.name = "ask_entity_property"

module.exports.isEnable = true