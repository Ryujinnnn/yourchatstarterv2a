const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const chatbot = require('../chatbot_engine')
const { verifyToken } = require('./middleware/verify_token')
const { initial_context } = require('../chatbot_engine/data_model')
const { actionDispatch } = require('../routine/action_dispatcher')

router.post('/', verifyToken, async (req, res) => {
    //console.log(req)
    let input = req.body;
    let message = input.post;
    let context = input.context;
    let is_local = input.is_local

    if (!context || !context.intent_stack || !context.information_key || !context.suggestion_list) {
        context = {
            information_key: [],
            intent_stack: [],
            suggestion_list: [],
        }
    }

    let option = {
        isPaid: req.is_paid,
        plan: req.plan
    }

    console.log(option)

    let response = "", action, updated_context

    [response, updated_context, action] = await chatbot.get_response_local(message, option, context)

    //console.log(action)

    if (action && action !== {}) {
        //the whole req object is not needed but fuck it
        actionDispatch(action, req)
    }

    res.send({
        response: response,
        context: updated_context,
        action: action
    });
});

module.exports = router