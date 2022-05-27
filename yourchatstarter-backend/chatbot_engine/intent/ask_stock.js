const get_stockmarket = require('../../info_module/get_stockmarket')
const { crypto_infographic } = require('../../info_module/infographic_generator')

module.exports.run = (entities, option, context, isLocal = false) => {
    const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (option.isPaid && permitted_tier.includes(option.plan)) {
            if (isLocal) {
                let stock_code = entities.find((val) => val.entity === "stock_code")
                if (!stock_code) {
                    response = "Bạn có thể nói rõ mã cổ phiếu là gì được không?"
                }
                else {
                    let code = stock_code.option
                    let stock_res = await get_stockmarket(code).catch(e => console.log(e))
                    if (!stock_res) {
                        response = `Mình không thể tìm được mã cổ phiếu này :(`
                    }
                    else {
                        response = `Mã cổ phiếu ${code} đang được niêm yết ở mức ${stock_res.stockIndex} điểm ở sàn NASDAQ nhé`
                        await crypto_infographic(stock_res.timeSeries)
                            .then(
                            (data_uri) => {response += "\n![stock infographic](" + data_uri + ")"},
                            (e) => response += ``)
                    }
                }
            }
            else {
                if (!entities['stock_code:stock_code']) {
                    response = "Bạn có thể nói rõ mã cổ phiếu là gì được không?"
                }
                else {
                    let code = entities['stock_code:stock_code'][0].body
                    await get_stockmarket(code)
                        .then(
                        (stock_res) => {response = `Mã cổ phiếu ${code} đang được niêm yết ở mức ${stock_res.stockIndex} điểm ở sàn NASDAQ nhé`},
                        (e) => response = `Mình không thể tìm được mã cổ phiếu này :(`)
                }   
            }
            context.suggestion_list = ["mốc điểm cổ phiếu FB", "mã cổ phiếu AMZN đang ở mức bao nhiêu điểm?", "1 đô la ra mấy VND?", "cảm ơn"]
        }
        else {
            response = "Chức năng này là chỉ dành cho khách hàng hạng tiêu chuẩn trở lên nhé :D"
        }
        resolve([response, context, {}])
    })
}


module.exports.name = "ask_stock"

module.exports.isEnable = true