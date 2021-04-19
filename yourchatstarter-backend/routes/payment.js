const express = require('express')
const { checkOut } = require('../payment/checkout')
const router = express.Router()

router.get('/request_payment', (req, res) => {

})

router.post('/submit_payment', (req, res) => {
    //placeholder
    let payment_link = checkOut()
    console.log(payment_link)
})

router.get('/success', (req, res) => {
    res.send({info: "payment success"})
})

router.get('/failure', (req, res) => {
    res.send({info: "payment failed"})
})