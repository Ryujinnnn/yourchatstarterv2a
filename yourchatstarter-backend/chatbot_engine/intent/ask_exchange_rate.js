const get_exchange = require('../../info_module/get_exchange')

module.exports.run = (entities, option, context) => {
    const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        if (option.isPaid && permitted_tier.includes(option.plan)) {
            if ((!entities['currency:currency']) || (!entities['wit$amount_of_money:amount_of_money'])) {
                response = 'Mình không rõ bạn muốn đổi từ tiền gì ra tiền gì :('
            }
            else {
                let from_currency = entities['wit$amount_of_money:amount_of_money'][0].unit
                let amount = entities['wit$amount_of_money:amount_of_money'][0].value
                let to_currency = entities['currency:currency'][0].value
        
                await get_exchange(amount, from_currency, to_currency)
                    .then(
                        (forex_res) => {response = `${amount} ${from_currency} đổi ra được ${forex_res.result} ${to_currency} nhé`},
                        (e) => response = `Mình không đổi loại tiền này được bạn ạ :(`
                    )
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