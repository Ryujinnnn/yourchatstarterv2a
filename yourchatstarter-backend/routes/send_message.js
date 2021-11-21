const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const chatbot = require('../chatbot_engine')
const { verifyToken } = require('./middleware/verify_token')
const { initial_context } = require('../chatbot_engine/data_model')

router.post('/', verifyToken, async (req, res) => {
    //console.log(req)
    let input = req.body;
    let message = input.post;
    let context = input.context;
    let is_local = input.is_local

    if (!context || !context.past_client_message) {
        context = initial_context
    }

    let option = {
        isPaid: req.is_paid,
        plan: req.plan
    }

    console.log(option)

    let response = "", updated_context;
    if (is_local) { 
        [response, updated_context] = await chatbot.get_response_local(message, option, context)}
    else {
        [response, updated_context] = await chatbot.get_response(message, option, context)
    }
    res.send({
        response: response,
        context: updated_context
    });
});

module.exports = router