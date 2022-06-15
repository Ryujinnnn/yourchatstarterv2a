const { default: axios } = require("axios")
const db = require('../../database/database_interaction')

function onesignal_api() {
    //TODO: endpoint (POST) https://onesignal.com/api/v1/notifications

    const option = {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + process.env.ONESIGNAL_API
        },

    }
    const message = {
        app_id: "c4f18d2d-08d5-450d-9865-3fe344cfb813",
        contents: {"en": "Test awooga"},
        channel_for_external_user_ids: "push",
        include_player_ids: ["0aa86292-840c-481c-bb1b-7aad58929bb0"]
    }

    const endpoint = 'https://onesignal.com/api/v1/notifications'

    axios.post(endpoint, message , option, (err) => {
        console.log(err)
    }).then(res => {
        console.log(res.data)
    })
}

function send_notification(content, title = "YourChatStarter", action = {}, client_id = []) {
    const option = {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + process.env.ONESIGNAL_API
        },

    }
    const message = {
        app_id: "c4f18d2d-08d5-450d-9865-3fe344cfb813",
        contents: {"en": content},
        channel_for_external_user_ids: "push",
        include_player_ids: client_id
    }

    const endpoint = 'https://onesignal.com/api/v1/notifications'

    axios.post(endpoint, message , option, (err) => {
        console.log(err)
    }).then(res => {
        console.log(res.data)
        let res_obj = res.data
        if (res_obj.errors) {
            //check error for invalid player ids
            if (res_obj.errors["invalid_player_ids"]) {
                //remove invalid ids from the database
                res_obj.errors["invalid_player_ids"].forEach(async (invalid_id) => {
                    let remove_query = {
                        subscriptionId: invalid_id,
                        type: "onesignal"
                    }

                    let res = await db.removeRecords("notification_subscription", remove_query).catch(err => console.log(err))

                    if (res) {
                        console.log("removed subscriber id: " + invalid_id)
                    }
                })
            }
        }
    })
}

module.exports.send_notification = send_notification