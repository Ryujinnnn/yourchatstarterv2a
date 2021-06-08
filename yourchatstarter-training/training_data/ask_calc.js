const entity = require('../constants/entity_type')

module.exports.name = 'ask_calc'

module.exports.data_simple = [
    {text: "17+20 bằng mấy?", entities: [{entity: entity.MATH_EXPRESSION, body: '17+20'}], traits: []},
    {text: "1+1 bằng bao nhiêu?", entities: [{entity: entity.MATH_EXPRESSION, body: '1+1'}], traits: []},
    {text: "2+3*12-4 bằng mấy?", entities: [{entity: entity.MATH_EXPRESSION, body: '2+3*12-4'}], traits: []},
    {text: "30+3-12+1 bằng bao nhiêu?", entities: [{entity: entity.MATH_EXPRESSION, body: '30+3-12+1'}], traits: []},
]

module.exports.data_full = []