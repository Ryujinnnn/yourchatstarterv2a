const {crypto} = require('../../info_module/get_stockmarket')

module.exports.run = (entities, option, context) => {
    const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (option.isPaid && permitted_tier.includes(option.plan)) {
            if (!entities['currency:currency']) {
                response = "Bạn có thể nói rõ là bạn muốn đổi ra đơn vị gì được không?"
            }
            else if (!entities['crypto:crypto']) {
                response = "Bạn có thể nói rõ là bạn muốn đổi từ loại tiền ảo gì được không?"
            }
            else {
                let crypto_from = entities['crypto:crypto'][0].value
                let currency_to = entities['currency:currency'][0].value
                let symbol = crypto_from + "/" + currency_to
                await crypto(symbol)
                    .then(
                    (crypto_res) => {response = `Tỉ giá ${symbol} đang được niêm yết ở mức 1 ${crypto_from} = ${crypto_res.cryptoIndex} ${currency_to} (${(crypto_res.cryptoChangePercent > 0)? "+" + crypto_res.cryptoChangePercent.toFixed(3) : crypto_res.cryptoChangePercent.toFixed(3) }% trong 24h qua) nhé`},
                    (e) => response = `Mình không thể tìm được cặp giá trị này bạn ơi :(`)
            }   
        }
        else {
            response = "Chức năng này là chỉ dành cho khách hàng hạng tiêu chuẩn trở lên nhé :D"
        }
        resolve([response, context])
    })
}


module.exports.name = "ask_crypto"

module.exports.isEnable = true