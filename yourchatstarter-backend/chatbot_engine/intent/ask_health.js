const random_helper = require("../utils/random_helper")

const askHealthResponsePool = [
    "Mình khỏe nhé bạn :)",
    "Mình khỏe nhé. Còn bạn?"
]

module.exports.run = (entities, option, context) => {
    context.suggestion_list = ['Thời tiết ở Hà Nội như thế nào?', '1 USD đổi ra bao nhiêu VND?', 'Bạn nói "Thank you very much" bằng tiếng việt như thế nào?']
    return [askHealthResponsePool[random_helper(askHealthResponsePool.length)], context]
}

module.exports.name = "ask_health"

module.exports.isEnable = true