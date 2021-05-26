const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const crypto = require('crypto')

router.post('/login', async (req, res) => {
    let input = req.body
    console.log(input)
    let queryInfo = {
        username: input.username,
        hashed_password: crypto.createHash('md5').update(input.password).digest('hex')
    }
    let query_result = await db.queryRecord("user", queryInfo)
    if (query_result.length > 0) {
        let token = crypto.createHash('md5').update(query_result[0].hashed_password).update(new Date().toISOString()).digest('hex')
        let sessionInfo = {
            token: token,
            username: query_result[0].username,
            createdAt: new Date(),
            is_paid: (query_result[0].paid_valid_until > new Date())? true : false,
            plan: (query_result[0].paid_valid_until > new Date())? query_result[0].plan : "none",
        }
        let action_result = await db.addRecord("session", sessionInfo)
        if (action_result) {
            res.send({
                status: "success",
                desc: "login success",
                token: token,
            })
        }
        else {
            res.send({
                status: "failure",
                desc: "internal server error",
            })
        }
    }
    else {
        res.send({
            status: "failure",
            desc: "username or password not match"
        })
    }
})

router.post('/register', async (req, res) => {
    let input = req.body;
    if (!input.username || !input.password || !input.confirm_password || !input.email) {
        res.send({
            status: "failure",
            desc: "You need to fill all the fields to register"
        })
    }
    if (input.confirm_password != input.password) {
        res.send({
            status: "failure",
            desc: "passwords do not match"
        })
        return
    }
    let dupSearchQuery = {
        username: input.username
    }
    let query_result = await db.queryRecord("user", dupSearchQuery)
    if (query_result.length > 0) {
        res.send({
            status: "failure",
            desc: "username already existed"
        })
        return
    }
    let recordInfo = {
        username: input.username,
        hashed_password: crypto.createHash('md5').update(input.password).digest('hex'),
        email: input.email,
        paid_valid_until: new Date(0),
        plan: "none",
    }
    let action_result = await db.addRecord("user", recordInfo)
    if (action_result) {
        res.send({
            status: "success",
            desc: "register success"
        })
    }
    else {
        res.send({
            status: "failure",
            desc: "server error"
        })
    }
    return
})

router.get('/logout', () => {
    //TODO: delete sender token
})

router.post('/verify_token', async (req, res) => {
    let input = req.body;
    let tokenQuery = {
        token: input.token
    }

    let query_result = await db.queryRecord("session", tokenQuery)
    if (query_result.length == 0) {
        res.send({
            status: "failure",
            desc: "token not exist"
        })
        return
    }
    else {
        res.send({
            status: "success",
            desc: "token verification success",
            is_paid: query_result[0].is_paid,
            plan: query_result[0].plan
        })
        return
    }
}) 

module.exports = router