const { convert } = require('convert')
const get_exchange = require('../../info_module/get_exchange')
const { crypto_infographic } = require('../../info_module/infographic_generator')

module.exports.run = (entities, option, context, isLocal = false) => {
    //const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        let from_currency = entities.find((val) => val.entity === "currency" && val.alias === "currency_0") 
        let amount = entities.find((val) => val.entity === "custom_number")
        let to_currency =  entities.find((val) => val.entity === "currency" && val.alias === "currency_1") 

        if (from_currency && amount && to_currency) {
            //console.dir(from_currency, {depth: null})
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
        }
        else {
            let from_unit = entities.find((val) => val.entity === "conversion_unit" && val.alias === "conversion_unit_0") 
            let amount_conv = entities.find((val) => val.entity === "custom_number") 
            let to_unit =  entities.find((val) => val.entity === "conversion_unit" && val.alias === "conversion_unit_1") 

            if (from_unit && amount_conv && to_unit) {
                //additional guard for built-in type
                let from_unit_val = from_unit.option
                let amount_conv_val = amount_conv.resolution.value
                let to_unit_val = to_unit.option

                console.log(amount_conv_val, from_unit_val, to_unit_val)

                try {
                    // console.log()
                    let conv_res = convert(amount_conv_val, from_unit_val).to(to_unit_val)
                    response = `${amount_conv_val} ${from_unit.sourceText} đổi ra được ${conv_res} ${to_unit.sourceText} nhé`
                }
                catch (e) {
                    console.log(e)
                    response = `Mình không đổi đơn vị này được bạn ạ :(`
                }
            }
            else {
                response = 'Mình không rõ bạn muốn đổi đơn vị gì :('
            }
        }
        resolve([response, context, {}])
    })
}

//console.log(convert(1, "square meter").to("square kilometer"))


module.exports.name = "ask_conversion"

module.exports.isEnable = true
