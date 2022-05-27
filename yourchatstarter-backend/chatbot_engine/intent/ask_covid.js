const get_covid_info = require('../../info_module/covid_info/get_covid_info')

module.exports.run = (entities, option, context, isLocal = false) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (isLocal) {
            let location_entity = entities.find((val) => val.entity === "location")
            if (!location_entity) {
                let result = await get_covid_info.get_stat()
                //console.log(result)
                response = `Hiện tại cả nước ghi nhận ${result.case} ca ${(result.daily_case) ? "(+ " + result.daily_case  +  " ca hôm nay)" : ""}  nhiễm COVID-19, đã chữa khỏi ${result.recovered} ca ${(result.daily_recovered) ? "(+ " + result.daily_recovered  +  " ca hôm nay)" : ""}, và đã có ${result.death} ca tử vong ${(result.daily_death) ? "(+ " + result.daily_death  +  " ca hôm nay)" : ""}`
            }
            else {
                let location = location_entity.option
                await get_covid_info.get_stat(location)
                    .then(
                        (result) => { response = `Hiện tại ${location} ghi nhận ${result.case} ca nhiễm COVID-19 ${(result.daily_case) ? "(+ " + result.daily_case  +  " ca hôm nay)" : ""} , và đã có ${result.death} ca tử vong` },
                        (e) => { response = `Không tìm thấy ${location} trong danh sách, có thể địa điểm này chưa ghi nhận ca mắc nào hoặc bạn đã nhập sai địa điểm`}
                    )
            }
        }
        else {
            //legacy wit support
            if (!entities['wit$location:location']) {
                let result = await get_covid_info.get_stat()
                console.log(result)
                response = `Hiện tại cả nước ghi nhận ${result.case} ca ${(result.daily_case) ? "(+ " + result.daily_case  +  " ca hôm nay)" : ""}  nhiễm COVID-19, đã chữa khỏi ${result.recovered} ca ${(result.daily_recovered) ? "(+ " + result.daily_recovered  +  " ca hôm nay)" : ""}, và đã có ${result.death} ca tử vong ${(result.daily_death) ? "(+ " + result.daily_death  +  " ca hôm nay)" : ""}`
            }
            else {
                let location = entities['wit$location:location'][0].value
                await get_covid_info.get_stat(location).
                    then(
                        (result) => { response = `Hiện tại ${location} ghi nhận ${result.case} ca nhiễm COVID-19 ${(result.daily_case) ? "(+ " + result.daily_case  +  " ca hôm nay)" : ""} , và đã có ${result.death} ca tử vong` },
                        (e) => { response = `Không tìm thấy ${location} trong danh sách, có thể địa điểm này chưa ghi nhận ca mắc nào hoặc bạn đã nhập sai địa điểm`}
                    )
            }
        }
        context.suggestion_list = ['Bạn khỏe không?', 'Lời khuyên covid', 'Tình hình covid như thế nào', 'tình hình dịch covid ở hà nội như thế nào']
        resolve([response, context, {}])
    })
}

module.exports.name = "ask_covid"
module.exports.isEnable = true