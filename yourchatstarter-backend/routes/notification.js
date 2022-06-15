const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const { verifyToken } = require('./middleware/verify_token')
var crypto = require('crypto');
const webpush = require('web-push');

const vapidKeys = {
    privateKey: process.env.PRIVATE_VAPID,
    publicKey:
      'BKCgepgxlhniRpbB7E1AjqRlet413-ac-6nJxTu9Wh_7Kw_hjuASZHaoe5qrhZiPbTmm7DKznbZg5P7D1rCHyt8'
};

webpush.setVapidDetails('mailto:neroyuki241@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(Buffer.from(input));
    return md5sum.digest('hex');
}

router.post('/subscribe', verifyToken, async (req, res) => {

    const subscriptionRequest = req.body.data;

    console.log("+ received subscribing request")

    if (!subscriptionRequest) {
        res.status(400).json({ 
            status: 'failed',
            desc: 'no subscriber request is sent',
        })
        return
    }

    const subscriptionId = createHash(JSON.stringify(subscriptionRequest))

    let subscriber_query = {
        subscriptionId: subscriptionId,
    }

    let subscriber_action = {
        $set: {
            userId: req.user_id, 
            // subscriptionId: subscriptionId,
            subscriptionRequest: subscriptionRequest
        }

    }
    let insert_res = await db.editRecords("notification_subscription", subscriber_query, subscriber_action, {upsert: true})
    if (!insert_res) {  
        res.status(500).json({ 
            status: 'failed',
            desc: 'internal server error',
        })
    };
    res.status(201).json({ 
        status: 'success',
        desc: 'subscribing successfully',
        id: subscriptionId 
    })
})

router.post('/subscribe_push', verifyToken, async (req, res) => {
    const subscriptionId = req.body.data.subscriber_id;
    //const subscriptionId = createHash(JSON.stringify(subscriptionRequest))

    if (!subscriptionId) {
        res.status(400).json({ 
            status: 'failed',
            desc: 'no subscriber id is sent',
        })
        return
    }

    let subscriber_query = {
        subscriptionId: subscriptionId,
    }

    let subscriber_action = {
        $set: {
            userId: req.user_id, 
            // subscriptionId: subscriptionId,
            // subscriptionRequest: subscriptionRequest,
            type: 'onesignal'
        }

    }
    let insert_res = await db.editRecords("notification_subscription", subscriber_query, subscriber_action, {upsert: true})
    if (!insert_res) {  
        res.status(500).json({ 
            status: 'failed',
            desc: 'internal server error',
        })
    };
    res.status(201).json({ 
        status: 'success',
        desc: 'subscribing successfully',
        id: subscriptionId 
    })
})

router.get('/send_notif/:id', async (req, res) => {
    const subscriptionId = req.params.id;

    let message = {
        subscriptionId: subscriptionId,
        next_schedule: new Date(new Date() + 1000 * 120),
        message: {
            title: 'From your assistant',
            text: 'This is a test notification'
        },
        type: 'one-time'
    }

    let insert_res = await db.addRecord("scheduled_message", message)
    if (!insert_res) {  
        res.status(500).json({ 
            status: 'failed',
            desc: 'internal server error',
        })
    };
    res.status(200).json({ 
        status: 'success',
        desc: 'message is scheduled' 
    })

})

module.exports = router