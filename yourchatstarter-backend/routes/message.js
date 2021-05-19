const express = require('express')
const { initial_context } = require('../chatbot_engine/data_model')
const router = express.Router()

router.get('/', function (req, res) {
    let context = initial_context
    context.suggestion_list = ['Chào bạn', 'Bạn khỏe không?', 'Thời tiết ở Hà Nội như thế nào?']
    res.send({ 
        express: 'Hello From Express',
        context: context
    })
})

module.exports = router