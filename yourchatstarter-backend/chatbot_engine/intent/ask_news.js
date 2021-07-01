const { get_news } = require("../../info_module/get_news")
const random_helper = require("../utils/random_helper")

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        let category = ""
        if (entities['news_category:news_category']) category = entities['news_category:news_category'][0].value
        console.log("fetching news")
        await get_news(category)
            .then(
                (news_res) => {response = `[${new Date(news_res.created_at).toLocaleString('vi-VN', {timeZone: "Asia/Ho_Chi_Minh"})}] ${news_res.title}: ${news_res.desc} [${news_res.article_link} - Đọc thêm tại VNExpress/]`},
                (e) => response = `Hôm nay mình quên mua báo rồi bạn ơi :(`)
        resolve([response, context])
    })
}

module.exports.name = "ask_news"

module.exports.isEnable = true