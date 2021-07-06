const { get_announcement } = require("../../info_module/covid_info/get_covid_info")
const random_helper = require("../utils/random_helper")

module.exports.run = (entities, option, context) => {
    return new Promise((resolve, reject) => {
        context.suggestion_list = ['Tin tức sức khỏe', 'Tình hình covid ở Hồ Chí Minh như thế nào?', 'Bạn khỏe không?']
        get_announcement().then(
        (res) => {
            let newest = res[0]
            let brief = newest.content.split('\n')[0]
            let response = `[${newest.time.toLocaleString('vi-VN', {timeZone: "Asia/Ho_Chi_Minh"})}] ${brief} [https://ncov.moh.gov.vn/dong-thoi-gian - Chi tiết tại website chính thức của bộ y tế /]`
            context.suggestion_list = ['Tình hình Covid như thế nào', 'Lời khuyên Covid', 'Bạn khỏe không']
            resolve([response, context])
        },
        (e) => {
            console.log(e)
            let response = 'Mình không thể tìm thấy bản tin Covid mới nhất, mình xin lỗi :('
            resolve([response, context])
        }
    ) 
    }) 
}

module.exports.name = "covid_news"

module.exports.isEnable = true