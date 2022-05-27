module.exports.run = (entities, option, context) => {
    context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức', "Bạn đang sống ở đâu"]
    return ['Mình cũng chẳng biết tên mình là gì nữa, hmmm...', context]
}

module.exports.name = "ask_name"

module.exports.isEnable = true