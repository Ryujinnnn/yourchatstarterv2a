module.exports.run = (entities, option, context) => {
    return new Promise((resolve, reject) => {
        let response = ""
        if (!entities['wit$math_expression:math_expression']) {
            response = "Bạn muốn tính gì?"
        }
        else {
            let expr_str = entities['wit$math_expression:math_expression'][0].body
            response = `bằng ${eval(expr_str)} nhé`
        }
        //console.log(response)
        resolve([response, context])
    })
}

module.exports.name = "ask_calc"

module.exports.isEnable = true