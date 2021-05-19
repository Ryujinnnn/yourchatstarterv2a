const random_helper = require("../utils/random_helper")

const askHealthResponsePool = [
    "Mình khỏe nhé bạn :)",
    "Mình khỏe nhé. Còn bạn?"
]

module.exports.run = (entities, option, context) => {
    return [askHealthResponsePool[random_helper(askHealthResponsePool.length)], context]
}

module.exports.name = "ask_health"

module.exports.isEnable = true