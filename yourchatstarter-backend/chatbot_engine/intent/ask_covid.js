const get_covid_info = require('../../info_module/covid_info/get_covid_info')

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (!entities['wit$location:location']) {
            let result = await get_covid_info.get_stat()
            console.log(result)
            response = `Hiện tại cả nước ghi nhận ${result.case} ca nhiễm COVID-19, đã chữa khỏi ${result.recovered} ca, và đã có ${result.death} ca tử vong`
        }
        else {
            let location = entities['wit$location:location'][0].value
            let result = await get_covid_info.get_stat(location)
            if (result == "not found") {
                response = `Không tìm thấy ${location} trong danh sách, có thể địa điểm này chưa ghi nhận ca mắc nào hoặc bạn đã nhập sai địa điểm`
            }
            else  {
                response = `Hiện tại ${location} ghi nhận ${result.case} ca nhiễm COVID-19, đã chữa khỏi ${result.recovered} ca, và đã có ${result.death} ca tử vong`
            }
        }
        context.suggestion_list = ['Bạn khỏe không?', 'Lời khuyên covid']
        resolve([response, context])
    })
}

module.exports.name = "ask_covid"
module.exports.isEnable = true