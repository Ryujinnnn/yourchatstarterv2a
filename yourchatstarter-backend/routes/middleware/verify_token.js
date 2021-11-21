const db = require('../../database/database_interaction')

module.exports.verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    let tokenQuery = {
        token: token
    }

    if (!token) {
        req.username = null
        req.is_paid = false,
        req.plan = "none"
        next()
        return
    }
    let query_result = await db.queryRecord("session", tokenQuery)
    if (query_result.length == 0) {
        req.username = null
        req.is_paid = false,
        req.plan = "none"
        next()
    }
    else {
        req.username = query_result[0].username
        req.is_paid = query_result[0].is_paid,
        req.plan = query_result[0].plan
        next()
    }
}