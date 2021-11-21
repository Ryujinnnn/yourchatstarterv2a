const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const { verifyToken } = require('./middleware/verify_token')
const subscriptions = {};
var crypto = require('crypto');
const webpush = require('web-push');

const vapidKeys = {
    privateKey: 'a' ,
    publicKey: 'b'
};

webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(Buffer.from(input));
    return md5sum.digest('hex');
}

router.post('/subscribe', verifyToken, (req, res) => {
    const subscriptionRequest = req.body.data;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions[susbscriptionId] = subscriptionRequest;
    res.status(201).json({ id: susbscriptionId });
})

router.get('/send_notif/:id', (req, res) => {
    const subscriptionId = req.params.id;
    const pushSubscription = subscriptions[subscriptionId];
    webpush
        .sendNotification(
            pushSubscription,
            JSON.stringify({
                title: 'New Product Available ',
                text: 'HEY! Take a look at this brand new t-shirt!',
                image: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
                tag: 'new-product',
                url: '/new-product-jason-leung-HM6TMmevbZQ-unsplash.html'
            })
        )
        .catch((err) => {
            console.log(err);
        });

    res.status(202).json({});
})

module.exports = router