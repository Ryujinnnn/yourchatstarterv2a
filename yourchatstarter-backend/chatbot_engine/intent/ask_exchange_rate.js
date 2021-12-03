const get_exchange = require('../../info_module/get_exchange')

const currencyString2Symbol = {
    "Dollar": "USD"
}

module.exports.run = (entities, option, context, isLocal = false) => {
    const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (option.isPaid && permitted_tier.includes(option.plan)) {
            if (isLocal) { 
                response = "a"
                console.log(entities)

                let from_currency = entities.find((val) => val.entity === "currency" && val.alias === "currency_0") 
                let amount = entities.find((val) => val.entity === "number") 
                let to_currency =  entities.find((val) => val.entity === "currency" && val.alias === "currency_1") 

                if (from_currency && amount && to_currency) {
                    //additional guard for built-in type
                    let from_currency_val = from_currency.option || currencyString2Symbol[from_currency.resolution.unit]
                    let amount_val = amount.resolution.value
                    let to_currency_val = to_currency.option || currencyString2Symbol[to_currency.resolution.unit]

                    await get_exchange(amount_val, from_currency_val, to_currency_val)
                        .then(
                            (forex_res) => { response = `${amount_val} ${from_currency_val} đổi ra được ${forex_res.result} ${to_currency_val} nhé` },
                            (e) => response = `Mình không đổi loại tiền này được bạn ạ :(`
                        )
                }
                else {
                    response = 'Mình không rõ bạn muốn đổi từ tiền gì ra tiền gì :('
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
        }
        else {
            response = "Chức năng này là chỉ dành cho khách hàng hạng tiêu chuẩn trở lên nhé :D"
        }
        resolve([response, context])
    })
}

module.exports.name = "ask_exchange_rate"
module.exports.isEnable = true