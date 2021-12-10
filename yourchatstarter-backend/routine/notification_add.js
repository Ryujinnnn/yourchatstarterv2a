const db = require('../database/database_interaction')

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

    let insert_res = await db.addRecord("scheduled_message", message)

    if (insert_res) {
        return true
    }
    return false
}