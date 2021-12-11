const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const crypto = require('crypto')
const { verifyToken } = require('./middleware/verify_token')
const { ObjectID } = require('mongodb')

router.post('/login', async (req, res) => {
    let input = req.body
    //console.log(input)
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
            user_id: query_result[0]._id,
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

    //let userInfoRecord = new User(input.username)
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

router.get('/logout', verifyToken ,() => {
    //TODO: delete sender token
    if (!req.user_id) {
        res.send({
            status: 'failed',
            desc: "failed token verification"
        })
        return
    }
    const token = req.headers['x-access-token']

    let tokenQuery = {
        token: token
    }

    let remove_res = db.removeRecords("session", tokenQuery)
    if (!remove_res) {
        res.send({
            status: 'failed',
            desc: "internal server error"
        })
        return
    }
    res.send({
        status: "succcess",
        desc: "successfully logged out"
    })
})

router.get('/verify_token', verifyToken, async (req, res) => {
    
    if (!req.username) {
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
            is_paid: req.is_paid,
            plan: req.plan,
            is_admin: req.username === "neroyuki"
        })
        return
    }
}) 

router.post('/change_password', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let input = req.body

    if (!input.old_password || !input.new_password || !input.confirm_new_password) {
        res.status(400).send({
            status: "failed",
            desc: 'missing required field'
        })
        return
    }

    let queryInfo = {
        _id: new ObjectID(req.user_id),
        hashed_password: crypto.createHash('md5').update(input.old_password).digest('hex')
    }
    let query_result = await db.queryRecord("user", queryInfo)

    if (!query_result || query_result.lenght === 0) {
        res.status(401).send({
            status: "failed",
            desc: "old password is incorrect"
        })

        return
    }
    let user = query_result[0]

    if (input.new_password !== input.confirm_new_password) {
        res.status(400).send({
            status: 'failed',
            desc: 'new password and confirm password does not match'
        })
        return
    }

    let user_action = {
        $set: {
            hashed_password: crypto.createHash('md5').update(input.new_password).digest('hex')
        }
    }

    let update_db_res = await db.editRecords("user", queryInfo, user_action)
    if (!update_db_res) {
        res.status(500).send({
            status: "failed",
            desc: "internal server error"
        })
    }

    res.status(200).send({
        status: "success",
        desc: "password changed successfully"
    })
})

module.exports = router