const entity = require('../constants/entity_type')

module.exports.name = 'ask_stock'

module.exports.data_simple = [
    {text: "Cổ phiếu GOOGL đang ở mốc bao nhiêu điểm", entities: [{entity: entity.STOCK_CODE, body: 'GOOGL'}], traits: []},
    {text: "Mã cổ phiếu AAPL đang ở mức bao nhiêu điểm?", entities: [{entity: entity.STOCK_CODE, body: 'AAPL'}], traits: []},
    {text: "Cổ phiểu AMZN đang ở mức bao nhiêu điểm vậy?", entities: [{entity: entity.STOCK_CODE, body: 'AMZN'}], traits: []},
]

module.exports.data_full = []