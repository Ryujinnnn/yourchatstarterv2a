const { NlpManager, ConversationContext} = require('node-nlp')
const location_vn = require('./ner_data/geolocation_VN.json')
const crypto_pair = require('./ner_data/crypto.json')
const stocks_list = require('./ner_data/stocks_nasdaq.json')

async function main() {
	const options = { languages: ['vi'], forceNER: true };
	const manager = new NlpManager(options);

	// manager.container.registerConfiguration('bert', {
	// 	url: 'http://localhost:8000/tokenize',
	// 	languages: ['vi']
	// });
	// manager.container.use(LangBert);
	// const dock = await dockStart({ use: ['Basic'] });
	let nlp = manager.nlp

	await manager.nlp.addCorpora([
		'./corpus_data/corpus-vi-basic.json',
		'./corpus_data/corpus-vi-service.json'
	])

	const locationKeys = Object.keys(location_vn);
	console.log('loading location data...')
	for (let i = 0; i < locationKeys.length; i += 1) {
		const location = location_vn[locationKeys[i]];
		const location_canon_name = locationKeys[i]
		manager.addNamedEntityText('location', location_canon_name, 'vi', location_canon_name);
	}

	manager.addNamedEntityText('location', 'Thành phố Hồ Chí Minh', 'vi', ['TP.HCM', 'TP. Hồ Chí Minh', 'thành phố hồ chí minh'])

	console.log('loading stock code data...')
	for (let i = 0; i < stocks_list.length; i++) {
		const stock_entry = stocks_list[i]
		manager.addNamedEntityText('stock_code', stock_entry.Symbol, 'vi', stock_entry.Symbol)
	}
	
	// manager.addRegexEntity('email', 'vi', /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/)
	// manager.addRegexEntity('http_url', 'vi', /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/ )
	manager.addRegexEntity('phrase', "vi", /"[^"]+"/)
	manager.addRegexEntity('location_prompt', "vi", /^.*(?= ở đâu)/)
	manager.addRegexEntity('location_prompt', "vi", /(?<=định vị ).*$/)
	// manager.addRegexEntity('date', 'vi', /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
	// manager.addRegexEntity('time', 'vi', /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/)
	// manager.addRegexEntity('time', 'vi', /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
	// manager.addRegexEntity('time', 'vi', /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/)
	manager.addNamedEntityText('currency', 'VND', 'vi', ["VND", "việt nam đồng", "đ"])
	manager.addNamedEntityText('currency', 'USD', 'vi', ["USD", "đô la", "$"])
	manager.addNamedEntityText('crypto', 'BTC', 'vi', ["BTC", "bitcoin"])
	manager.addNamedEntityText('crypto', 'ETH', 'vi', ["ETH", "etherium"])
	manager.addNamedEntityText('language', 'en', 'vi', ["tiếng anh"])
	manager.addNamedEntityText('language', 'vi', 'vi', ["tiếng việt"])
	manager.addNamedEntityText('language', 'fr', 'vi', ["tiếng pháp"])
	manager.addNamedEntityText('language', 'de', 'vi', ["tiếng đức"])

	manager.addNamedEntityText('news_category', 'startup', 'vi', ['startup', 'start-up', 'start up', 'khởi nghiệp'])
	manager.addNamedEntityText('news_category', 'đời sống', 'vi', ['đời sống', 'cuộc sống'])
	manager.addNamedEntityText('news_category', 'thể thao', 'vi', ['thể thao'])
	manager.addNamedEntityText('news_category', 'du lịch', 'vi', ['du lịch'])
	manager.addNamedEntityText('news_category', 'giải trí', 'vi', ['giải trí'])
	manager.addNamedEntityText('news_category', 'khoa học', 'vi', ['khoa học'])
	manager.addNamedEntityText('news_category', 'số hóa', 'vi', ['số hóa', 'công nghệ'])
	manager.addNamedEntityText('news_category', 'quốc tế', 'vi', ['quốc tế', 'nước ngoài', 'nước ngoài'])
	manager.addNamedEntityText('news_category', 'xe hơi', 'vi', ['ô tô'])
	manager.addNamedEntityText('news_category', 'giáo dục', 'vi', ['giáo dục'])
	manager.addNamedEntityText('news_category', 'pháp luật', 'vi', ['pháp luật', 'luật pháp'])
	manager.addNamedEntityText('news_category', 'kinh doanh', 'vi', ['kinh doanh', 'doanh nghiệp'])
	manager.addNamedEntityText('news_category', 'sức khoẻ', 'vi', ['sức khỏe'])
	manager.addNamedEntityText('news_category', 'chuyện vui', 'vi', ['chuyện vui', 'hài hước', 'chuyện cười'])

	nlp.slotManager.addSlot('service.ask_weather', 'location', true, { vi: 'Bạn có thể cho mình biết là thời tiết ở đâu được không?' });
	nlp.slotManager.addSlot('service.req_translate', 'phrase', true, { vi: 'Bạn có thể cho mình biết là bạn muốn dịch gì được không?' });
	nlp.slotManager.addSlot('service.req_translate', 'language', true, { vi: 'Bạn có thể cho mình biết là bạn muốn dịch ra ngôn ngữ nào được không?' });

	// manager.addNamedEntityText('fromCity', 'trim');
	// manager.addBetweenCondition('vi', 'fromCity', 'từ', 'đến');
	// manager.addAfterLastCondition('vi', 'fromCity', 'từ');
	// manager.addNamedEntityText('toCity', 'trim');
	// manager.addBetweenCondition('vi', 'toCity', 'đến', 'ngày', { skip: ['đi'] });
	// //manager.addAfterLastCondition('vi', 'toCity', 'đến');
	// //manager.addBeforeCondition('vi', 'toCity', 'ngày')

	// nlp.slotManager.addSlot('agent.travel', 'fromCity', true, { vi: 'Bạn muốn đi từ đâu?' });
	// nlp.slotManager.addSlot('agent.travel', 'toCity', true, { vi: 'Bạn muốn đi tới đâu?' });

	// manager.addDocument('vi', 'Tôi muốn đi từ %fromCity% đến %toCity% ngày %date%', 'agent.travel');
	// manager.addAnswer('vi', 'agent.travel', 'Ok bạn, mình sẽ lưu lại')

	await nlp.train();
	//connector.say('Say something!');
}

main()