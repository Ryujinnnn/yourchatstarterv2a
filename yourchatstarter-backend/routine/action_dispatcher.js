const { addNotification } = require("./notification_add")

module.exports.actionDispatch = async (action, req) => {
    if (action.action === "REQUEST_NOTIFICATION") {
        //dispatch notification action
        let subscriberId = req.headers['subscriber-id']

        let scheduledMessageInfo = {
            subscriberId: subscriberId,
            userId: req.user_id,
            message: action.data.message,
            next_schedule: new Date(action.data.time),
            type: action.data.type
        }

        addNotification(scheduledMessageInfo)
    }
}