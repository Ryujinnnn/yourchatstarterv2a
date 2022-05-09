const { default: axios } = require("axios")

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
    })
}

module.exports.send_notification = send_notification