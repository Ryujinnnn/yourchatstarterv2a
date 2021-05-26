const SANDBOX_ENDPOINT = "https://sandbox-api.baokim.vn/payment/"

module.exports = function checkout(purchaseInfo) {
    return new Promise((resolve, reject) => {
        const PRODUCTION_SERVER_ENPOINT = 'http://yourchatstarter.xyz'
        const DEVELOPMENT_SERVER_ENDPOINT = 'http://localhost:3000'
        const SERVER_ENDPOINT = PRODUCTION_SERVER_ENPOINT

        let payment_data = {
            mrc_order_id: purchaseInfo.order_id,
            total_amount: purchaseInfo.amount,
            description: `purchase for yourchatstarter ${purchaseInfo.plan_name} subscription`,
            url_success: `${SERVER_ENDPOINT}/payment_success`,
            merchant_id: 35612,
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
    })
}