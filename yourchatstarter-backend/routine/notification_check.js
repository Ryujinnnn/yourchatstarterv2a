const db = require('../database/database_interaction')
var crypto = require('crypto');
const webpush = require('web-push');

module.exports.checkNotification = async () => {
    //console.log('scanning pending message')
    let pending_message_query = {
        next_schedule: { $lt: new Date() }
    }

    let message_res = await db.queryRecord("scheduled_message", pending_message_query)

    if (!message_res || message_res.length === 0) return

    message_res.forEach(async (val) => {
        if (val.userId) {
            let subscriber_query = {
                userId: val.userId
            } 

            let subscriber_res = await db.queryRecord("notification_subscription", subscriber_query)
            if (!subscriber_res || subscriber_res.length === 0) return

            subscriber_res.forEach((subscriber_res_entry) => {
                webpush.sendNotification(
                    subscriber_res_entry.subscriptionRequest,
                    JSON.stringify({
                        title: val.message.title,
                        text: val.message.text,
                        tag: 'yourchatstarter-message',
                        url: 'https://yourchatstarter.xyz/chat'
                    })
                ).catch((err) => {
                    console.log(err);
                });
            })
        }
        else {
            //find the receiver
            let subscriber_query = {
                subscriptionId: val.subscriptionId
            } 

            let subscriber_res = await db.queryRecord("notification_subscription", subscriber_query)
            if (!subscriber_res || subscriber_res.length === 0) return

            webpush.sendNotification(
                subscriber_res[0].subscriptionRequest,
                JSON.stringify({
                    title: val.message.title,
                    text: val.message.text,
                    tag: 'yourchatstarter-message',
                    url: 'https://yourchatstarter.xyz/chat'
                })
            ).catch((err) => {
                console.log(err);
            });
        }

        if (val.type === "one-time") {
            let delete_message_res = await db.removeRecords("scheduled_message", {_id: val._id})
        }
    })
}