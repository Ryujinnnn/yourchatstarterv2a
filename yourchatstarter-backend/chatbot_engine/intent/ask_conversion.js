const { convert } = require('convert')
const get_exchange = require('../../info_module/get_exchange')
const { crypto_infographic } = require('../../info_module/infographic_generator')
const rounding = require('../utils/rounding_helper')

module.exports.run = (entities, option, context, isLocal = false) => {
    //const permitted_tier = ["standard", "premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
        let from_currency = entities.find((val) => val.entity === "currency" && val.alias === "currency_0") 
        let amount = entities.find((val) => val.entity === "custom_number")
        let to_currency =  entities.find((val) => val.entity === "currency" && val.alias === "currency_1") 

        let context_intent_entry = {
            intent: this.name,
            addition_entities: [],
            confirmed_entities: [],
            missing_entities: []
        }

        let enough_entity = true

        if (from_currency && amount) {
            //console.dir(from_currency, {depth: null})
            //additional guard for built-in type

            context_intent_entry.confirmed_entities.push(amount)
            context_intent_entry.confirmed_entities.push(from_currency)

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
    
                context.suggestion_list = ["1 USD đổi ra bao nhiêu VND", "2.5 EUR đổi ra bao nhiêu đô la mỹ", "80000 VND đổi được bao nhiêu đô la", "Cảm ơn"]
            }
        }
        else {
            let from_unit = entities.find((val) => val.entity === "conversion_unit" && val.alias === "conversion_unit_0") 
            let amount_conv = entities.find((val) => val.entity === "custom_number") 
            let to_unit =  entities.find((val) => val.entity === "conversion_unit" && val.alias === "conversion_unit_1") 

            if (enough_entity && (!amount_conv || !from_unit)) {
                response = 'Bạn có thể nhập số và đơn vị đo bạn cần đổi được không'
                context_intent_entry.missing_entities.push('custom_number')
                context_intent_entry.missing_entities.push('conversion_unit_0')
                enough_entity = false
                context.suggestion_list = ['1 mét', '20 kilogram', '35 độ C']
            }
            else {
                context_intent_entry.confirmed_entities.push(amount_conv)
                context_intent_entry.confirmed_entities.push(from_unit)
            }

            if (enough_entity && !to_unit) {
                response = 'Bạn có thể nhập đơn vị bạn muốn đổi ra được không'
                context_intent_entry.missing_entities.push('conversion_unit_1')
                enough_entity = false
                context.suggestion_list = ['gam', 'độ F', 'yard']
            }
            else if (to_unit) {
                context_intent_entry.confirmed_entities.push(to_unit)
            }

            if (enough_entity) {
                //additional guard for built-in type
                let from_unit_val = from_unit.option
                let amount_conv_val = amount_conv.resolution.value
                let to_unit_val = to_unit.option

                console.log(amount_conv_val, from_unit_val, to_unit_val)

                try {
                    // console.log()
                    let conv_res = convert(amount_conv_val, from_unit_val).to(to_unit_val)
                    response = `${amount_conv_val.toLocaleString('vi-VN')} ${from_unit.sourceText} đổi ra được ${rounding(conv_res).toLocaleString('vi-VN')} ${to_unit.sourceText} nhé`
                }
                catch (e) {
                    console.log(e)
                    response = `Mình không đổi đơn vị này được bạn ạ :(`
                }
                context.suggestion_list = ["1 km đổi ra mấy yard", "20 lít đổi ra bao nhiêu gallon", "1 m đổi ra bao nhiêu feet", "Cảm ơn"]
            }
        }

        context.intent_stack.push(context_intent_entry)
        resolve([response, context, {}])
    })
}

//console.log(convert(1, "square meter").to("square kilometer"))


module.exports.name = "ask_conversion"

module.exports.isEnable = true
