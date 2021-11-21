const entity = require('../constants/entity_type')

module.exports.name = 'ask_exchange_rate'

module.exports.data_simple = [
    {text: "23000 VND ra mấy USD?", entities: [{entity: entity.AMOUNT_OF_MONEY, body: '23000 VND'}, {entity: entity.CURRENCY, body: 'USD'}], traits: []},
    {text: "25000 VND đổi ra bao nhiêu EUR", entities: [{entity: entity.AMOUNT_OF_MONEY, body: '25000 VND'}, {entity: entity.CURRENCY, body: 'EUR'}], traits: []},
    {text: "23000 đ ra mấy $?", entities: [{entity: entity.AMOUNT_OF_MONEY, body: '23000 đ'}, {entity: entity.CURRENCY, body: '$'}], traits: []},
    {text: "1 USD đổi ra bao nhiêu VND?", entities: [{entity: entity.AMOUNT_OF_MONEY, body: '1 USD'}, {entity: entity.CURRENCY, body: 'VND'}], traits: []},
]

module.exports.data_full = []