const get_translate = require('../../info_module/get_translate')

//FIXME: context

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
			let phrase_to_translate_entity = entities.find((val) => val.entity === "phrase")
			let language_code_entity = entities.find((val) => val.entity === "language")

			if (enough_entity && !phrase_to_translate_entity) {
				response = "Bạn có thể nói nội dung cần được dịch được không?"
				context_intent_entry.missing_entities.push('phrase')
				enough_entity = false
				context.suggestion_list = ['"Ra quán ăn"', '"Đi mua đồ"', '"Đi ngủ"', '"Làm bài tập"']
			}
			else {
				context_intent_entry.confirmed_entities.push(phrase_to_translate_entity)
			}

			if (enough_entity && !language_code_entity) {
				response = "Bạn muốn dịch sang ngôn ngữ gì nhỉ"
				context_intent_entry.missing_entities.push('language')
				enough_entity = false
				context.suggestion_list = ['tiếng Việt', 'tiếng Anh', 'tiếng Đức']
			}
			else if (language_code_entity) {              
				context_intent_entry.confirmed_entities.push(language_code_entity)
			}

			if (enough_entity) {
				let phrase_to_translate = phrase_to_translate_entity.utteranceText.replace(/\"/g, '')
				let language_code = language_code_entity.option
				await get_translate(phrase_to_translate, language_code) 
				.then(
					(trans_res) => {response = `Mình dịch ra thành "${trans_res.translated_text}" nhé`},
					(e) => response = `Mình không thể dịch được đoạn này bạn ơi :(`
				)
				context.suggestion_list = ["mình nói \"you are great\" trong tiếng việt như thế nào?", "dịch \"tôi đi đến trường\" sang tiếng anh", "cảm ơn"]
			}
		}
		else {
			response = "Không thể thực hiện chức năng này"
		}
		//let start_index = random_helper(smalltalk_suggestion.length)
		context.intent_stack.push(context_intent_entry)
        resolve([response, context, {}])
    })
}

module.exports.name = "req_translate"

module.exports.isEnable = true