const { get_vaccination } = require("../../info_module/covid_info/get_covid_info")

module.exports.run = (entities, option, context, isLocal = false) => {
    return new Promise(async (resolve, reject) => {
        let answer = "Mình không có thông tin về việc tiêm vaccine, mình xin lỗi"
        if (isLocal) {
            let res = await get_vaccination()
            if (res) {
                answer = `Tính đến ${new Date(res.allocatedDate).toLocaleDateString('vi-VN')}. Việt Nam đã tiêm tổng cộng ${res.objectInjection.toLocaleString('vi-VN')} mũi vaccine`
            }
        }
        context.suggestion_list = ['Tình hình covid như thế nào', 'Bạn khỏe không', "Tình hình covid ở hà nội", "cảm ơn"]
        resolve([answer, context, {}])
    })
}

module.exports.name = "ask_vaccination"

module.exports.isEnable = true