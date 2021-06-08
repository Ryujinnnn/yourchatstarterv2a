const entity = require('../constants/entity_type')

module.exports.name = 'req_translate'

module.exports.data_simple = [
    {text: "dịch \"trường học\" ra tiếng anh", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: 'trường học'}, {entity: entity.LANGUAGE, body: 'tiếng anh', value: 'en'}], traits: []},
    {text: "dịch \"hello\" ra tiếng việt", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: 'hello'}, {entity: entity.LANGUAGE, body: 'tiếng việt', value: 'vi'}], traits: []},
    {text: "dịch \"give me a pen\" ra tiếng việt", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: 'give me a pen'}, {entity: entity.LANGUAGE, body: 'tiếng việt', value: 'vi'}], traits: []},
    {text: "dịch \"I'm beautiful\" ra tiếng việt", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: "I'm beautiful"}, {entity: entity.LANGUAGE, body: 'tiếng việt', value: 'vi'}], traits: []},
    {text: "bạn nói yên bình như thế nào bằng tiếng anh?", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: "yên bình"}, {entity: entity.LANGUAGE, body: 'tiếng anh', value: 'en'}], traits: []},
    {text: "mình nói trường học trong tiếng Anh như thế nào nhỉ?", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: "trường học"}, {entity: entity.LANGUAGE, body: 'tiếng Anh', value: 'en'}], traits: []},
    {text: "bạn nói sorry như thế nào bằng tiếng việt?", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: "sorry"}, {entity: entity.LANGUAGE, body: 'tiếng việt', value: 'vi'}], traits: []},
    {text: "mình nói tôi tài giỏi trong tiếng Anh như thế nào?", entities: [{entity: entity.PHRASE_TO_TRANSLATE, body: "tôi tài giỏi"}, {entity: entity.LANGUAGE, body: 'tiếng Anh', value: 'en'}], traits: []},
]

module.exports.data_full = []