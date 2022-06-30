const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const { verifyToken } = require('./middleware/verify_token')
const { ObjectID } = require('mongodb')

router.get('/profile', verifyToken , async (req, res) => {
    let return_user_result = {
        username: "",
        email: "",
        paid_valid_until: "",
        status: "",
    }
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }
    const plan_name = {
        none: "Hạng miễn phí",
        standard: "Hạng tiêu chuẩn",
        premium: "Hạng cao cấp",
        lifetime: "Hạng trọn đời",
    }
    let user_query = {
        username: req.username,
    }
    let user_result = await db.queryRecord("user", user_query)
    
    if (user_result.length == 0) {
        // how?
        res.status(200).send({
            status: 'failed',
            desc: 'username not found',
            user: return_user_result,
        })
        return
    }
    else {
        return_user_result.username = user_result[0].username,
        return_user_result.email = user_result[0].email,
        return_user_result.display_name = user_result[0].display_name || ""
        return_user_result.birthday = user_result[0].birthday || new Date()
        return_user_result.paid_valid_until = user_result[0].paid_valid_until.toLocaleString('vi', { timeZone: 'UTC' })
        return_user_result.status = (user_result[0].paid_valid_until > new Date())? plan_name[user_result[0].plan] : "Hạng miễn phí"
        res.send({
            status: 'success',
            desc: "user profile retrived",
            user: return_user_result
        })
    } 
})

router.post('/save_profile', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body
    if (!input.username || !input.email) {
        res.status(400).send({
            status: 'failed',
            desc: 'missing required field'
        })
        return
    }

    let username_query = {
        username: input.username
    }

    let username_query_res = await db.queryRecord("user", username_query)
    //console.log(req.user_id, "" + username_query_res[0]._id)
    if (username_query_res && username_query_res.length > 0 && req.user_id != "" + username_query_res[0]._id) {
        res.status(200).send({
            status: 'failed',
            desc: "username already in use"
        })
        return 
    }

    let user_query = {
        _id: new ObjectID(req.user_id)
    }

    let user_action = {
        $set: {
            // username: input.username,
            email: input.email,
        }
    }

    if (input.birthday) user_action.$set.birthday = new Date(input.birthday)
    if (input.display_name) user_action.$set.display_name = input.display_name

    let update_user_res = db.editRecords("user", user_query, user_action)
    if (!update_user_res) {
        res.status(500).send({
            status: "failed",
            desc: "internal server error"
        })
        return
    }

    res.status(200).send({
        status: "success",
        desc: "user info saved successfully"
    })
})

router.get('/get_preference', verifyToken, async (req, res) => {    
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let user_query = {
        user_id: req.user_id
    }

    let preference_result = await db.queryRecord("user_preference", user_query)
    if (!preference_result || !preference_result.length === 0) {
        res.status(200).send({
            status: 'failed',
            desc: "user preference is not found, saving op will insert a new preference",
        })
        return
    }

    res.status(200).send({
        status: "success",
        desc: "user preference is found",
        preference: preference_result[0]
    })
})

router.post('/save_preference', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body

    let user_query = {
        user_id: new ObjectID(req.user_id)
    }

    let preference_action = {
        $set: {
            user_id: new ObjectID(req.user_id),
            //general setting
            allow_auto_t2s: input.allow_auto_t2s || false,
            allow_push_notification: input.allow_push_notification || false,
            allow_voice_recording: input.allow_voice_recording || false,
            //t2s setting
            voice_selection: input.voice_selection || "",
            voice_rate: input.voice_rate || 0.8
        }
    }

    let update_db_res = await db.editRecords("user_preference", user_query, preference_action, {upsert: true})
    if (!update_db_res) {
        res.status(500).send({
            status: 'failed',
            desc: "internal server error"
        })
        return
    }

    res.status(200).send({
        status: "success",
        desc: "user preference successfully updated"
    })
})

router.get('/billing', verifyToken , async (req, res) => {
    let billing_list_result = []

    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            username: "",
            billing_list: []
        })
        return 
    }

    let billing_query = {
        username: req.username
    }

    let billing_result = await db.queryRecord("billing", billing_query)
    if (billing_result.length == 0) {
        res.send({
            status: 'success',
            desc: 'no payment found',
            username: token_result[0].username,
            billing_list: []
        })
        return
    }
    billing_result.forEach((val) => {
        let billing_entry = {
            created_at: val.created_at.toLocaleString('vi', { timeZone: 'UTC' }),
            plan_name: val.plan_name,
            amount: val.amount,
        }
        billing_list_result.push(billing_entry)
    })
    res.send({
        status: 'success',
        desc: 'retrieve billing list successfully',
        username: token_result[0].username,
        billing_list: billing_list_result,
    })
})

module.exports = router