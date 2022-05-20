const SANDBOX_ENDPOINT = "https://sandbox-api.baokim.vn/payment/"
const PRODUCTION_ENDPOINT = "https://api.baokim.vn/payment/"
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const FormData = require('form-data');

const API_KEY = process.env.BAOKIM_API;
const API_SECRET = process.env.BAOKIM_SECRET;
const TOKEN_EXPIRE = 60; //token expire time in seconds
const ENCODE_ALG = 'HS256';

require('dotenv').config()

function time() {
    var timestamp = Math.floor(new Date().getTime() / 1000)
    return timestamp;
}

function generateAccessToken(data) {
    return jwt.sign(data, API_SECRET, { algorithm: 'HS256' });
}

module.exports = function checkout(purchaseInfo) {
    return new Promise(async (resolve, reject) => {
        const PRODUCTION_SERVER_ENPOINT = 'https://yourchatstarter.xyz'
        const DEVELOPMENT_SERVER_ENDPOINT = 'https://localhost:5000'
        const SERVER_ENDPOINT = PRODUCTION_SERVER_ENPOINT
        

        let payment_data = {
            mrc_order_id: purchaseInfo.order_id,
            total_amount: purchaseInfo.amount,
            description: `purchase for yourchatstarter ${purchaseInfo.plan_name} subscription`,
            url_success: `${SERVER_ENDPOINT}/payment_success`,
            merchant_id: 35725,
            url_detail:  `${SERVER_ENDPOINT}/payment_failure`,
            lang: "vi",
            accept_bank: 1,
            accept_cc: 1,
            accept_qrpay: 1,
            accept_e_wallet: 1,
            webhooks: `${SERVER_ENDPOINT}/api/payment/confirm_payment`,
            customer_email: purchaseInfo.email,
            customer_phone: purchaseInfo.phone_number,
            customer_name: purchaseInfo.name,
            customer_address: purchaseInfo.address
        }
        let paymentLink = "";
        Object.keys(payment_data).forEach((key) => {
            paymentLink += key + "=" + payment_data[key] + "&"
        }) 

        let issue_time = time() 
        let jwtInput = {
            iat: issue_time,
            jti: Buffer.from(uuidv4()).toString('base64'),
            iss: API_KEY,
            nbf: issue_time,
            exp: issue_time + 60,
            form_params: payment_data,
        }

        let str = generateAccessToken(jwtInput)


        //console.log(paymentLink)
        let formData = new FormData()
        Object.keys(payment_data).forEach((key) => {
            formData.append(key, payment_data[key])
        }) 

        let setting = {
            method: "POST",
            body: formData,
            headers: {
                jwt: "Bearer " + str
            }
        }

        let res = await fetch(PRODUCTION_ENDPOINT + "api/v4/order/send", setting)
        console.log(res)
        let res_obj = await res.json().catch((e) => {resolve({message: e, data: null})})
        console.log(res_obj)
        resolve(res_obj)
    })
}