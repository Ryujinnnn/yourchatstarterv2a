const { addNotification, removeNotification } = require("./notification_data")

module.exports.actionDispatch = async (action, req) => {
    let subscriberId = req.headers['subscriber-id']
    
    if (action.action === "REQUEST_NOTIFICATION") {
        //dispatch notification action

        let scheduledMessageInfo = {
            subscriberId: subscriberId,
            userId: req.user_id,
            message: action.data.message,
            next_schedule: new Date(action.data.time),
            type: action.data.type,
        }

        if (action.data.type === "interval") scheduledMessageInfo.interval = action.data.interval

        addNotification(scheduledMessageInfo)
    }
    if (action.action === "CANCEL_NOTIFICATION") {
        let scheduledMessageQuery = {
            subscriberId: subscriberId,
            userId: req.user_id,
            message: {$regex: `${action.data.message}.*`, $options: 'i'},
        }

        //console.log(scheduledMessageQuery)

        removeNotification(scheduledMessageQuery)
    }
}