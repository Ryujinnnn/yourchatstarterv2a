const get_stockmarket = require('../../info_module/get_stockmarket')

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (!entities['stock_code:stock_code']) {
            response = "Bạn có thể nói rõ mã cổ phiếu là gì được không?"
        }
        else {
            let code = entities['stock_code:stock_code'][0].body
            await get_stockmarket(code)
                .then(
                (stock_res) => {response = `Mã cổ phiếu ${code} đang được niêm yết ở mức ${stock_res.stockIndex} điểm nhé`},
                (e) => response = `Mình không thể tìm được mã cổ phiếu này :(`)
        }
        resolve([response, context])
    })
}


module.exports.name = "ask_stock"

module.exports.isEnable = true