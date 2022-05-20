module.exports.run = (entities, option, context) => {
    context.suggestion_list = ['Bạn khỏe không?', 'Trợ giúp', 'Tin tức']
    return ['Mình cũng chẳng biết tên mình là gì nữa, hmmm...', context]
}

module.exports.name = "ask_routing"

module.exports.isEnable = false