const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')

router.post('/profile', async (req, res) => {
    let input = req.body
    let return_user_result = {
        username: "",
        email: "",
        paid_valid_until: "",
        status: "",
    }
    let token_query = {
        token: input.token,
    }
    let token_result = await db.queryRecord("session", token_query)
    if (token_result.length == 0) {
        
        res.send({
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
        username: token_result[0].username,
    }
    let user_result = await db.queryRecord("user", user_query)
    
    if (user_result.length == 0) {
        // how?
        res.send({
            status: 'failed',
            desc: 'username not found',
            user: return_user_result,
        })
        return
    }
    else {
        return_user_result.username = user_result[0].username,
        return_user_result.email = user_result[0].email
        return_user_result.paid_valid_until = user_result[0].paid_valid_until.toLocaleString('vi', { timeZone: 'UTC' })
        return_user_result.status = (user_result[0].paid_valid_until > new Date())? plan_name[user_result[0].plan] : "Hạng miễn phí"
        res.send({
            status: 'success',
            desc: "user profile retrived",
            user: return_user_result
        })
    } 
})

router.post('/billing', async (req, res) => {
    let input = req.body
    let billing_list_result = []
    let token_query = {
        token: input.token,
    }
    let token_result = await db.queryRecord("session", token_query)
    if (token_result.length == 0) {
        res.send({
            status: "failed",
            desc: "token verification failed",
            username: "",
            billing_list: []
        })
        return 
    }
    let billing_query = {
        username: token_result[0].username,
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