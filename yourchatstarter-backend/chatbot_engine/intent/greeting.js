const random_helper = require("../utils/random_helper")

const greetingResponsePool = [
    "Chào bạn",
    "Chào bạn, mình có thể giúp gì cho bạn?",
]

module.exports.run = (entities, option, context) => {
    return [greetingResponsePool[random_helper(greetingResponsePool.length)], context]
}

module.exports.name = "greeting"

module.exports.isEnable = true