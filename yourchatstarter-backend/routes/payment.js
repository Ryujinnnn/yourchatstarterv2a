const express = require('express')
const checkout = require('../payment/checkout')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const db = require('../database/database_interaction')

router.get('/confirm_payment', async (req, res) => {
    console.log(req)
    let query_info = req.query
    //TODO: check this order with existing pending bill list
    //add new confirmed bill
    //change current user is_paid_until_value arcording to plan name
    //change current user session state to paid
    
    res.send("1")
    let pending_billing_query = {
        order_id: query_info.order_code,
        secure_code: query_info.secure_code,
    }
    let query_result = await db.queryRecord("pending_bill", pending_billing_query)
    if (query_result.length == 0) {
        console.log("ERROR: can't find any pending bill match the confirmed order")
        return
    }
    //find session
    let session_query = {
        token: query_result.token,
    }

    let session_query_result = await db.queryRecord("session", session_query)
    if (session_query_result.length == 0) {
        console.log("ERROR: can't find any session match the completed bill's session")
        return
    }
    //update session
    let update_action = {
        $set: {
            is_paid: true
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
        amount: query_info[0].amount,
    }
    let add_billing_result = await db.addRecord("billing", billing_record)
    if (!add_billing_result) {
        console.log("ERROR: can't add payment bill")
    }
    let number_of_date_to_add = 0
    switch (query_result.plan_name) {
        case 'premium': number_of_date_to_add = 30; break;
        case 'lifetime': number_of_date_to_add = 7200; break;
        default: number_of_date_to_add = 0;
    }
    let today = new Date()
    let new_expire_date = today.setDate((today > user_query_result[0].paid_valid_until)? today.getDate() + number_of_date_to_add : user_query_result[0].paid_valid_until.getDate() + number_of_date_to_add)
    //update user
    let update_user_action = {
        $set: {
            paid_valid_until: new_expire_date
        }
    }
    let update_user_result = await db.editRecords("user", user_query, update_user_action)
    if (!update_user_result) {  
        console.log("ERROR: failed to update user, please do not delete billing info for support referencing")
    }
})

router.post('/submit_info', async (req, res) => {
    let input = req.body
    //TODO: add this to a pending bill list (include token and username)
    let purchaseInfo = {
        plan_name: input.plan_name,
        amount: input.amount,
        name: input.name,
        email: input.email,
        phone_number: input.phone_number.replace(/([^\w\d\s])/g, ""),
        address: input.address.replace(/([^\w\d\s])/g, ""),
        order_id: uuidv4(),
    }
    
    let payment_link = checkout(purchaseInfo)

    let pending_billing_record = {
        token: input.user_token,
        order_id: purchaseInfo.order_id,
        secure_code: payment_link.secure_code,
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
    //console.log(payment_link)
    res.send({
        status: "success",
        checkout_link: payment_link.link
    })
})

router.get('/success', (req, res) => {
    res.send({info: "payment success"})
})

router.get('/failure', (req, res) => {
    res.send({info: "payment failed"})
})

module.exports = router