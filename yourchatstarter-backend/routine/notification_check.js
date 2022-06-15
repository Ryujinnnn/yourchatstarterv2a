const db = require('../database/database_interaction')
const { get_news } = require("../info_module/get_news")
const get_weather = require('../info_module/get_weather')
const { send_notification } = require('./notification/onesignal_api')
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

        let message_send = {
            title: val.message.title,
            text: val.message.text,
            tag: 'yourchatstarter-message',
            url: 'https://yourchatstarter.xyz/chat'
        }

        let receiving_client = []

        //process message into real message
        if (message_send.text.startsWith("activity:news")) {
            let news_res = await get_news().catch(err => console.log(err))
            if (!news_res) return
            message_send.text = `[${new Date(news_res.created_at).toLocaleString('vi-VN')}] ${news_res.title}: ${news_res.desc}`
        }

        if (message_send.text.startsWith("activity:weather")) {
            let location = message_send.text.split('/')[1]
            let weather_res = await get_weather(location).catch(err => console.log(err))
            if (!weather_res) return
            message_send.text = `Hiện tại ở ${location} trời đang ${weather_res.desc}, nhiệt độ khoảng ${weather_res.temp.toFixed(2)} độ C`
        }

        //first check if this scheduled message target an user or a client
        if (val.userId) {
            //if its an user, query all devices binded to that user
            let subscriber_query = {
                userId: val.userId
            } 

            let subscriber_res = await db.queryRecord("notification_subscription", subscriber_query)
            if (!subscriber_res || subscriber_res.length === 0) return

            subscriber_res.forEach((subscriber_res_entry) => {
                receiving_client.push(subscriber_res_entry)
            })
        }
        else {
            //find the receiver
            let subscriber_query = {
                subscriptionId: val.subscriptionId
            } 

            let subscriber_res = await db.queryRecord("notification_subscription", subscriber_query)
            if (!subscriber_res || subscriber_res.length === 0) return

            receiving_client.push(subscriber_res[0])
        }

        receiving_client.forEach(client => {
            if (client.type === "onesignal") {
                send_notification(message_send.text, message_send.title, {}, [client.subscriptionId])
                return
            }
            webpush.sendNotification(
                client.subscriptionRequest,
                JSON.stringify(message_send)
            ).catch((err) => {
                console.log(err);
            });
        })

        //update scheduled message table accordingly
        if (val.type === "one-time") {
            let delete_message_res = await db.removeRecords("scheduled_message", {_id: val._id})
        }
        else if (val.type === "interval") {
            let message_action = {
                $set: {
                    next_schedule: new Date(val.next_schedule.valueOf() + val.interval)
                }
            } 
            let subscriber_res = await db.editRecords("scheduled_message", {_id: val._id}, message_action, {upsert: true} )
        }
    })
}