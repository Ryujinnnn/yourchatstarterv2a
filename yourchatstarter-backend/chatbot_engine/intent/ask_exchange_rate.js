const get_exchange = require('../../info_module/get_exchange')
const { crypto_infographic } = require('../../info_module/infographic_generator')


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
            response = "a"
            let enough_entity = true
            //console.log(entities)

            let from_currency = entities.find((val) => val.entity === "currency" && val.alias === "currency_0") 
            let amount = entities.find((val) => val.entity === "custom_number") 
            let to_currency =  entities.find((val) => val.entity === "currency" && val.alias === "currency_1") 

            if (enough_entity && (!amount || !from_currency)) {
                response = 'Bạn có thể nhập số tiền bạn cần đổi được không'
                context_intent_entry.missing_entities.push('custom_number')
                context_intent_entry.missing_entities.push('currency_0')
                enough_entity = false
                context.suggestion_list = ['1 USD', '300000 VND', '20 đô la']
            }
            else {
                context_intent_entry.confirmed_entities.push(amount)
                context_intent_entry.confirmed_entities.push(from_currency)
            }

            if (enough_entity && !to_currency) {
                response = 'Bạn có thể nhập đơn vị tiền bạn muốn đổi ra được không'
                context_intent_entry.missing_entities.push('currency_1')
                enough_entity = false
                context.suggestion_list = ['USD', 'VND', 'EUR']
            }
            else if (to_currency) {
                context_intent_entry.confirmed_entities.push(to_currency)
            }

            if (enough_entity) {
                //additional guard for built-in type
                let from_currency_val = from_currency.option || currencyString2Symbol[from_currency.resolution.unit]
                let amount_val = amount.resolution.value
                let to_currency_val = to_currency.option || currencyString2Symbol[to_currency.resolution.unit]

                let forex_res = await get_exchange(amount_val, from_currency_val, to_currency_val).catch(e => console.log(e))
                if (!forex_res) {
                    response = `Mình không đổi loại tiền này được bạn ạ :(`
                }
                else {
                    response = `${amount_val} ${from_currency_val} đổi ra được ${forex_res.result} ${to_currency_val} nhé`
                    await crypto_infographic(forex_res.timeSeries)
                        .then(
                        (data_uri) => {response += "\n![stock infographic](" + data_uri + ")"},
                        (e) => response += ``)
                }
                context.suggestion_list = ["1 đô la ra mấy VND?", "12 EUR đổi ra mấy JPY", "1 đô la đổi được bao nhiêu bạt thái"]
            }
        }
        else {

            if ((!entities['currency:currency']) || (!entities['wit$amount_of_money:amount_of_money'])) {
                response = 'Mình không rõ bạn muốn đổi từ tiền gì ra tiền gì :('
            }
            else {
                let from_currency = entities['wit$amount_of_money:amount_of_money'][0].unit
                let amount = entities['wit$amount_of_money:amount_of_money'][0].value
                let to_currency = entities['currency:currency'][0].value

                await get_exchange(amount, from_currency, to_currency)
                    .then(
                        (forex_res) => { response = `${amount} ${from_currency} đổi ra được ${forex_res.result} ${to_currency} nhé` },
                        (e) => response = `Mình không đổi loại tiền này được bạn ạ :(`
                    )
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, {}])
    })
}

module.exports.name = "ask_exchange_rate"
module.exports.isEnable = true