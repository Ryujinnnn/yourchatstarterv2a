const express = require('express')
const { initial_context } = require('../chatbot_engine/data_model')
const router = express.Router()
const { get_sentiment } = require('./chatbot_engine/external_service/sentiment_analysist')

router.get('/', function (req, res) {
    let context = initial_context
    context.suggestion_list = ['Chào bạn', 'Bạn khỏe không?', 'Thời tiết ở Hà Nội như thế nào?']
    res.send({ 
        express: 'Hello From Express',
        context: context
    })
})

router.post('/test_sentiment', function (req, res) {
    let input = req.body;
    let text = input.text;
    let sentiment_res = await get_sentiment(text).catch(e => console.log(e))
    if (sentiment_res) {
        //console.log(sentiment_res)
        res.status(200).send({
            status: 'success',
            segmented_input: sentiment_res.segmented,
            result: sentiment_res.intent,
            certainty: sentiment_res.certainty
        })
    }
    else {
        console.log('error in sentiment analysis server')
        res.status(500).send({
            status: 'failed',
            message: 'error in sentiment analysis server'
        })
    }
})

module.exports = router