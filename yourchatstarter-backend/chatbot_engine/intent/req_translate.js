const get_translate = require('../../info_module/get_translate')

module.exports.run = (entities, option, context, isLocal = false) => {
	const permitted_tier = ["premium", "lifetime"]
    return new Promise(async (resolve, reject) => {
        let response = ""
		if (option.isPaid && permitted_tier.includes(option.plan)) {
			if (isLocal) {
				let phrase_to_translate_entity = entities.find((val) => val.entity === "phrase")
				let language_code_entity = entities.find((val) => val.entity === "language")

				if (!phrase_to_translate_entity || !language_code_entity) {
					response = 'Mình không rõ bạn muốn dịch gì :('
				}
				else {
					let phrase_to_translate = phrase_to_translate_entity.utteranceText
					let language_code = language_code_entity.option
					await get_translate(phrase_to_translate, language_code) 
					.then(
						(trans_res) => {response = `"${trans_res.translated_text}"`},
						(e) => response = `Mình không thể dịch được đoạn này bạn ơi :(`
					)
				}
			}
			else {
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
		}
		else { 
			response = "Chức năng này là chỉ dành cho khách hàng hạng cao cấp trở lên nhé :D"
		}
        resolve([response, context, {}])
    })
}

module.exports.name = "req_translate"

module.exports.isEnable = true