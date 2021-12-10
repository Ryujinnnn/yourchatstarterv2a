const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')
const { ObjectID } = require('mongodb')
const crypto = require('crypto')

//TODO: hide this

router.get('/all_user', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let err = null
    let user_res = await db.queryRecord('user', {}, {hashed_password: 0}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            user_list: user_res
        })
    }
})

router.get('/from_id/:id', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let id = req.params.id

    if (!id || !ObjectID.isValid(id)) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let err = null
    let user_res = await db.queryRecord('user', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else if (user_res.length === 0) {
        res.send({
            status: "failed",
            desc: "user not found"
        })
    } 
    else {
        res.send({
            status: 'success',
            user: user_res[0] 
        })
    }
})


router.post('/save_user', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body;

    if (!input.username || !input.email || (!input.hashed_password && !input.new_password)) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let user_query = {
        _id: new ObjectID(input._id) || new ObjectID()
    }

    let user_action = {
        $set: {
            username: input.username,
            email: input.email,
            plan: input.plan || "none",
            paid_valid_until: new Date(input.paid_valid_until) || new Date(0)
        },
    }

    //password field
    if (input.new_password) user_action.$set.hashed_password = crypto.createHash('md5').update(input.new_password).digest('hex')
    else user_action.$set.hashed_password = input.hashed_password

    //optional field
    if (input.birthday) user_action.$set.birthday = new Date(input.birthday)
    if (input.display_name) user_action.$set.display_name =  input.display_name

    let err = null
    let user_action_res = await db.editRecords("user", user_query, user_action, {upsert: true}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Lưu thông tin người dùng thành công"
        })
    }
})

router.delete('/from_id/:id', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let id = req.params.id

    if (!id || !ObjectID.isValid(id)) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let err = null
    let user_res = await db.removeRecords('user', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Xóa người dùng thành công"
        })
    }
})

module.exports = router