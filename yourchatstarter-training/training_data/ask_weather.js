const entity = require('../constants/entity_type')

module.exports.name = 'ask_weather'

module.exports.data_simple = [
    {text: "Thời tiết ở hà nội thế nào?", entities: [{entity: entity.LOCATION, body: 'hà nội'}], traits: []},
    {text: "Thời tiết ở thành phố hồ chí minh thế nào?", entities: [{entity: entity.LOCATION, body: 'thành phố hồ chí minh'}], traits: []},
    {text: "Thời tiết ở thủ đô nước Việt Nam thế nào?", entities: [{entity: entity.LOCATION, body: 'thủ đô nước Việt Nam', value: 'hà nội'}], traits: []}
]

module.exports.data_full = []