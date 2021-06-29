const random_helper = require("../utils/random_helper")

module.exports.run = (entities, option, context) => {
    return ["Các bạn hãy tuân thủ quy tắc 5K: Khẩu trang, khoảng cách, không tập trung, khai báo và khử khuẩn nhé :D", context]
}

module.exports.name = "covid_recommend"

module.exports.isEnable = true