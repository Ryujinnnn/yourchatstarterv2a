const { NlpManager, ConversationContext} = require('node-nlp')

async function main() {
	const options = { languages: ['vi']};
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