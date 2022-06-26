const db = require('../../database/database_interaction')

module.exports.verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    let tokenQuery = {
        token: token
    }

    if (!token) {
        req.user_id = null
        req.username = null
        req.is_paid = false,
        req.plan = "none"
        next()
        return
    }
    let query_result = await db.queryRecord("session", tokenQuery)
    if (query_result.length == 0) {
        req.user_id = null
        req.username = null
        req.is_paid = false,
        req.plan = "none"
        next()
    }
    else {
        req.user_id = query_result[0].user_id
        req.username = query_result[0].username
        req.is_paid = query_result[0].is_paid,
        req.plan = query_result[0].plan,
        req.is_admin = (query_result[0].user_id == process.env.ADMIN_ID)
        next()
    }
}