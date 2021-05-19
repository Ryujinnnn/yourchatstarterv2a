const get_translate = require('../../info_module/get_translate')

module.exports.run = (entities, option, context) => {
    return new Promise(async (resolve, reject) => {
        let response = ""
		if (option.isPaid) {
			if ((!entities['language:language']) || (!entities['wit$phrase_to_translate:phrase_to_translate'])) {
				response = 'Mình không rõ bạn muốn dịch gì :('
			}
			else {
				let phrase_to_translate = entities['wit$phrase_to_translate:phrase_to_translate'][0].body
				let language_code = entities['language:language'][0].value
				await get_translate(phrase_to_translate, language_code) 
				.then(
					(trans_res) => {response = `"${trans_res.translated_text}"`},
					(e) => response = `Mình không thể dịch được đoạn này bạn ơi :(`
				)
			}
		}
		else { 
			response = "Chức năng này là chỉ dành cho khách hàng trả phí nhé :D"
		}
        resolve([response, context])
    })
}

module.exports.name = "req_translate"

module.exports.isEnable = true