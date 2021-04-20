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
    //TODO: session database for token
    if (query_result.length > 0) {
        res.send({
            status: "success",
            desc: "login success",
            token: query_result[0].hashed_password
        })
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
    if (input.confirm_password != input.password) {
        res.send({
            status: "failure",
            reason: "passwords do not match"
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
            reason: "username already existed"
        })
        return
    }
    let recordInfo = {
        username: input.username,
        hashed_password: crypto.createHash('md5').update(input.password).digest('hex'),
        email: input.email
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
    
})

module.exports = router