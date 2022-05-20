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

module.exports.removeNotification = async (scheduledMessageQuery) => {
    let query = {
        message: {
            text: scheduledMessageQuery.message
        },
    }

    if (scheduledMessageQuery.userId) query.userId = new ObjectID(scheduledMessageQuery.userId)
    else if (scheduledMessageQuery.subscriberId) query.subscriptionId = scheduledMessageInfo.subscriberId
    else return false

    let remove_res = await db.removeRecords('scheduled_message', query).catch(err => console.log(err))

    if (remove_res) {
        return true
    }
    return false
}