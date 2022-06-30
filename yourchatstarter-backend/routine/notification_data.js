const db = require('../database/database_interaction')
const { ObjectID } = require('mongodb')

module.exports.addNotification = async (scheduledMessageInfo) => {
    let message = {
        userId: scheduledMessageInfo.userId,
        subscriptionId: scheduledMessageInfo.subscriberId,
        next_schedule: scheduledMessageInfo.next_schedule,
        message: {
            title: 'Từ YourChatStarter',
            text: scheduledMessageInfo.message
        },
        type: scheduledMessageInfo.type
    }

    if (scheduledMessageInfo.type === "interval") message.interval = scheduledMessageInfo.interval

    let insert_res = await db.addRecord("scheduled_message", message).catch(err => console.log(err))

    if (insert_res) {
        return true
    }
    return false
}

module.exports.fetchActiveNotification = async (userId = null, subId = null) => {
    let res = []
    if (userId) {
        let query = {
            userId: new ObjectID(userId)
        }
    }
    else if (subId) {
        let query = {
            subscriptionId: subId
        }
    }
} 

module.exports.removeNotification = async (scheduledMessageQuery) => {
    let query = {
        "message.text": scheduledMessageQuery.message
    }

    if (scheduledMessageQuery.userId) query.userId = scheduledMessageQuery.userId
    else if (scheduledMessageQuery.subscriberId) query.subscriptionId = scheduledMessageInfo.subscriberId
    else return false

    console.log(query)

    let remove_res = await db.removeRecords('scheduled_message', query).catch(err => console.log(err))

    if (remove_res) {
        return true
    }
    return false
}