const express = require('express')
const checkout = require('../payment/checkout')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

router.get('/confirm_payment', (req, res) => {
    console.log(req)
})

router.post('/submit_info', (req, res) => {
    //placeholder
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
    let payment_link = checkout(purchaseInfo)
    //console.log(payment_link)
    res.send({
        status: "success",
        checkout_link: payment_link
    })
})

router.get('/success', (req, res) => {
    res.send({info: "payment success"})
})

router.get('/failure', (req, res) => {
    res.send({info: "payment failed"})
})

module.exports = router