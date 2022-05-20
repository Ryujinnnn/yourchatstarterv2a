const express = require('express')
const checkout = require('../payment/checkout')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const db = require('../database/database_interaction')
const crypto = require('crypto');
const baokim_checkout = require('../payment/baokim_checkout');
const { verifyToken } = require('./middleware/verify_token');

router.post('/confirm_payment', async (req, res) => {
    console.log("receiving transaction confirmation info")
    console.log(req)
    let query_info = req.body

    
    res.send( {err_code: 0 } )

    // let secure_string = ' ' + query_info['transaction_info'] 
    // + ' ' + query_info['order_code']
    // + ' ' + query_info['price']
    // + ' ' + query_info['payment_id']
    // + ' ' + query_info['payment_type']
    // + ' ' + query_info['error_text']
    // + ' ' + "64888" //HARDCODED MERCHANT CODE, MOVE IT ASAP
    // + ' ' + process.env.NL_TOKEN_3;

    // FIXME: redo 
    // secure_code = crypto.createHash('md5').update(secure_string).digest('hex');
    // if (secure_code !== query_info.secure_code) {
    //     console.log("ERROR: checksum failed, transaction info might have been tampered, aborting...")
    //     return
    // }

    let pending_billing_query = {
        order_id: query_info.order.mrc_order_id,
    }
    let query_result = await db.queryRecord("pending_bill", pending_billing_query)
    if (query_result.length == 0) {
        console.log("ERROR: can't find any pending bill match the confirmed order")
        return
    }
    //find session
    let session_query = {
        token: query_result[0].token,
    }

    let session_query_result = await db.queryRecord("session", session_query)
    if (session_query_result.length == 0) {
        console.log("ERROR: can't find any session match the completed bill's session")
        return
    }
    //update session
    let update_action = {
        $set: {
            is_paid: true,
            plan: query_result[0].plan_name,
        }
    }
    let update_session_result = await db.editRecords("session", session_query, update_action)
    if (!update_session_result) {
        console.log("ERROR: failed to update session status, you might need to ask user to re-login")
    }
    //find user
    let user_query = {
        username: session_query_result[0].username
    }
    let user_query_result = await db.queryRecord("user", user_query)
    if (user_query_result.length == 0) {
        console.log("ERROR: can't find any user match the completed bill's session")
        return
    }
    //add bill
    let billing_record = {
        username: user_query_result[0].username,
        created_at: new Date(),
        plan_name: query_result[0].plan_name,
        amount: query_result[0].amount,
    }
    let add_billing_result = await db.addRecord("billing", billing_record)
    if (!add_billing_result) {
        console.log("ERROR: can't add payment bill")
    }
    let number_of_date_to_add = 0
    switch (query_result[0].plan_name) {
        case 'standard': number_of_date_to_add = 30; break;
        case 'premium': number_of_date_to_add = 30; break;
        case 'lifetime': number_of_date_to_add = 7200; break;
        default: number_of_date_to_add = 0;
    }
    let today = new Date()
    let new_expire_date = today.setDate((today > user_query_result[0].paid_valid_until)? today.getDate() + number_of_date_to_add : user_query_result[0].paid_valid_until.getDate() + number_of_date_to_add)
    //update user
    let update_user_action = {
        $set: {
            paid_valid_until: new Date(new_expire_date),
            plan: query_result[0].plan_name
        }
    }
    let update_user_result = await db.editRecords("user", user_query, update_user_action)
    if (!update_user_result) {  
        console.log("ERROR: failed to update user, please do not delete billing info for support referencing")
    }
})

router.get('/confirm_payment', async (req, res) => {
    console.log("receiving transaction confirmation info")
    console.log(req)
    let query_info = req.query
    
    res.send( {err_code: 0 } )

    // let secure_string = ' ' + query_info['transaction_info'] 
    // + ' ' + query_info['order_code']
    // + ' ' + query_info['price']
    // + ' ' + query_info['payment_id']
    // + ' ' + query_info['payment_type']
    // + ' ' + query_info['error_text']
    // + ' ' + "64888" //HARDCODED MERCHANT CODE, MOVE IT ASAP
    // + ' ' + process.env.NL_TOKEN_3;

    // secure_code = crypto.createHash('md5').update(secure_string).digest('hex');
    // if (secure_code !== query_info.secure_code) {
    //     console.log("ERROR: checksum failed, transaction info might have been tampered, aborting...")
    //     return
    // }

    // let pending_billing_query = {
    //     order_id: query_info.order_code,
    // }
    // let query_result = await db.queryRecord("pending_bill", pending_billing_query)
    // if (query_result.length == 0) {
    //     console.log("ERROR: can't find any pending bill match the confirmed order")
    //     return
    // }
    // //find session
    // let session_query = {
    //     token: query_result[0].token,
    // }

    // let session_query_result = await db.queryRecord("session", session_query)
    // if (session_query_result.length == 0) {
    //     console.log("ERROR: can't find any session match the completed bill's session")
    //     return
    // }
    // //update session
    // let update_action = {
    //     $set: {
    //         is_paid: true,
    //         plan: query_result[0].plan_name,
    //     }
    // }
    // let update_session_result = await db.editRecords("session", session_query, update_action)
    // if (!update_session_result) {
    //     console.log("ERROR: failed to update session status, you might need to ask user to re-login")
    // }
    // //find user
    // let user_query = {
    //     username: session_query_result[0].username
    // }
    // let user_query_result = await db.queryRecord("user", user_query)
    // if (user_query_result.length == 0) {
    //     console.log("ERROR: can't find any user match the completed bill's session")
    //     return
    // }
    // //add bill
    // let billing_record = {
    //     username: user_query_result[0].username,
    //     created_at: new Date(),
    //     plan_name: query_result[0].plan_name,
    //     amount: query_result[0].amount,
    // }
    // let add_billing_result = await db.addRecord("billing", billing_record)
    // if (!add_billing_result) {
    //     console.log("ERROR: can't add payment bill")
    // }
    // let number_of_date_to_add = 0
    // switch (query_result[0].plan_name) {
    //     case 'standard': number_of_date_to_add = 30; break;
    //     case 'premium': number_of_date_to_add = 30; break;
    //     case 'lifetime': number_of_date_to_add = 7200; break;
    //     default: number_of_date_to_add = 0;
    // }
    // let today = new Date()
    // let new_expire_date = today.setDate((today > user_query_result[0].paid_valid_until)? today.getDate() + number_of_date_to_add : user_query_result[0].paid_valid_until.getDate() + number_of_date_to_add)
    // //update user
    // let update_user_action = {
    //     $set: {
    //         paid_valid_until: new Date(new_expire_date),
    //         plan: query_result[0].plan_name
    //     }
    // }
    // let update_user_result = await db.editRecords("user", user_query, update_user_action)
    // if (!update_user_result) {  
    //     console.log("ERROR: failed to update user, please do not delete billing info for support referencing")
    // }
})

router.post('/submit_info', verifyToken, async (req, res) => {
    if (!req.user_id) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let input = req.body

    let purchaseInfo = {
        plan_name: input.plan_name,
        amount: input.amount,
        name: input.name,
        email: input.email,
        phone_number: input.phone_number.replace(/([^\w\d\s])/g, ""),
        address: input.address.replace(/([^\w\d\s])/g, ""),
        order_id: uuidv4(),
    }

    //let payment_link = checkout(purchaseInfo)
    let payment_link = await baokim_checkout(purchaseInfo)

    if (!payment_link.data) {
        res.send({
            status: "failure",
            desc: "payment server error"
        })
        return
    }

    let pending_billing_record = {
        token: input.user_token,
        order_id: purchaseInfo.order_id,
        //secure_code: payment_link.secure_code,
        provided_payment_id: payment_link.data.order_id,
        plan_name: purchaseInfo.plan_name,
        amount: purchaseInfo.amount,
        createdAt: new Date()
    }

    let insert_result = await db.addRecord("pending_bill", pending_billing_record)
    if (!insert_result) {
        res.send({
            status: "failure",
            desc: "can't add pending billing record"
        })
        return
    }

    //console.log(payment_link.link)
    console.log(payment_link)
    res.send({
        status: "success",
        checkout_link: payment_link.data.payment_url
    })
})

router.get('/success', (req, res) => {
    res.send({info: "payment success"})
})

router.get('/failure', (req, res) => {
    res.send({info: "payment failed"})
})

module.exports = router