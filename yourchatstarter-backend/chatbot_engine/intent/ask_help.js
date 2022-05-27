const random_helper = require("../utils/random_helper")

const helpResponsePool = [
    "Bạn có thể sử dụng các câu gợi ý ở dưới để hỏi mình nhé",
    "Bạn có thể tham khảo phần Thông tin >> Chức năng của trang web để biết thêm nhé",
    "Dịch COVID đang hoành hành, hay là bạn thử nhập \"Tình hình covid\"?",
    "Bạn có thể nói một danh từ nào đó, mình sẽ thử tìm kiếm thông tin về nó nhé",
]

module.exports.run = (entities, option, context) => {
    context.suggestion_list = ['Thời tiết ở Hà Nội như thế nào?', '1 USD đổi ra bao nhiêu VND?', 'Bạn nói "Thank you very much" bằng tiếng việt như thế nào?', 'Chào bạn']
    return [helpResponsePool[random_helper(helpResponsePool.length)], context]
}

module.exports.name = "ask_help"

module.exports.isEnable = true