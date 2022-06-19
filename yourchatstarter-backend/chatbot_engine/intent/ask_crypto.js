const {crypto} = require('../../info_module/get_stockmarket')
const { crypto_infographic } = require('../../info_module/infographic_generator')

//FIXME: contextttttt
module.exports.run = (entities, option, context, isLocal = false) => {

    return new Promise(async (resolve, reject) => {
        let response = ""

        let context_intent_entry = {
            intent: this.name,
            addition_entities: [],
            confirmed_entities: [],
            missing_entities: []
        }
        if (isLocal) {
            let enough_entity = true
            let crypto_entity = entities.find((val) => val.entity === "crypto")
            let currency_entity = entities.find((val) => val.entity === "currency")

            if (enough_entity && !crypto_entity) {
                response = "Bạn có thể nói rõ là bạn muốn đổi từ loại tiền ảo gì được không?"
                context_intent_entry.missing_entities.push('crypto')
                enough_entity = false
                context.suggestion_list = ['Bitcoin', 'Litecoin', 'ETH']
            }
            else {
                context_intent_entry.confirmed_entities.push(crypto_entity)
            }

            if (enough_entity && !currency_entity) {
                response = "Bạn có thể nói rõ là bạn muốn đổi ra loại tiền gì được không?"
                context_intent_entry.missing_entities.push('currency')
                enough_entity = false
                context.suggestion_list = ['USD', 'VND', 'EUR']
            }
            else if (currency_entity) {
                context_intent_entry.confirmed_entities.push(currency_entity)
            }

            if (enough_entity) {
                let crypto_val = crypto_entity.option
                let currency_val = currency_entity.option
                let symbol = crypto_val + "/" + currency_val
                let crypto_res = await crypto(symbol).catch(e => console.log(e))
                if (!crypto_res) {
                    response = `Mình không thể tìm được cặp giá trị này bạn ơi :(`
                }
                else {
                    response = `Tỉ giá ${symbol} đang được niêm yết ở mức 1 ${crypto_val} = ${crypto_res.cryptoIndex} ${currency_val} (${(crypto_res.cryptoChangePercent > 0)? "+" + crypto_res.cryptoChangePercent.toFixed(3) : crypto_res.cryptoChangePercent.toFixed(3) }% trong 24h qua) nhé`
                    await crypto_infographic(crypto_res.timeSeries)
                        .then(
                        (data_uri) => {response += "\n![crypto infographic](" + data_uri + ")"},
                        (e) => response += ``)
                }

                context.suggestion_list = ["giá tiền ảo bitcoin sang USD như thế nào", "giá tiền ảo ETH qua EUR như thế nào", "Cảm ơn"]
            }
        }
        else {
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
        
        context.intent_stack.push(context_intent_entry)
        resolve([response, context, {}])
    })
}


module.exports.name = "ask_crypto"

module.exports.isEnable = true