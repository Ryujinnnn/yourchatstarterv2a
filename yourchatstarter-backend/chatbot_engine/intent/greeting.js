const random_helper = require("../utils/random_helper")

const greetingResponsePool = [
    "Chào bạn",
    "Chào bạn, mình có thể giúp gì cho bạn?",
]

module.exports.run = (entities, option, context) => {
    context.suggestion_list = ['Bạn khỏe không?', 'Thời tiết ở Hà Nội như thế nào?', 'Trợ giúp']
    return [greetingResponsePool[random_helper(greetingResponsePool.length)], context, {}]
}

module.exports.name = "greeting"

module.exports.isEnable = true