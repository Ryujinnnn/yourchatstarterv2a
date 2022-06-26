const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')
const { ObjectID } = require('mongodb')

router.get('/message_timeseries', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let pipeline = [
        {
            $group: {
                _id: {
                    $subtract: [
                        { $subtract: [ "$time", new Date("1970-01-01") ] },
                        { $mod: [ 
                            { $subtract: [ "$time", new Date("1970-01-01") ] },
                            1000 * 60 * 15
                        ]}
                    ]
                },
                message_receive: {
                    $sum: "$message_receive"
                },
                defined_intent: {
                    $sum: "$defined_intent"
                },
                slot_filling: {
                    $sum: "$slot_filling"
                },
                freeform_search: {
                    $sum: "$freeform_search"
                },
                unknown_intent: {
                    $sum: "$unknown_intent"
                },
                negative_utterance: {
                    $sum: "$negative_utterance"
                },
                positive_utterance: {
                    $sum: "$positive_utterance"
                },
                neutral_utterance: {
                    $sum: "$neutral_utterance"
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]

    let agg_res = await db.aggregateRecord("message_stat", pipeline)

    if (!agg_res || agg_res.length === 0) {
        res.status(500).send({
            status: 'failed'
        })
    }
    else {
        res.status(200).send({
            status: 'success',
            result: agg_res
        })
    }
    
})

router.get('/user_count', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let pipeline = [
        {
            $count: "user_count"
        }
    ]

    let agg_res = await db.aggregateRecord("user", pipeline)

    if (!agg_res || agg_res.length === 0) {
        res.status(500).send({
            status: 'failed'
        })
    }
    else {
        res.status(200).send({
            status: 'success',
            result: agg_res[0].user_count
        })
    }
})

router.get('/session_count', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let pipeline = [
        {
            $count: "user_count"
        }
    ]

    let agg_res = await db.aggregateRecord("session", pipeline)

    if (!agg_res || agg_res.length === 0) {
        res.status(500).send({
            status: 'failed'
        })
    }
    else {
        res.status(200).send({
            status: 'success',
            result: agg_res[0].user_count
        })
    }
})

router.get('/subcriber_count', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let pipeline = [
        {
            $count: "user_count"
        }
    ]

    let agg_res = await db.aggregateRecord("notification_subscription", pipeline)

    if (!agg_res || agg_res.length === 0) {
        res.status(500).send({
            status: 'failed'
        })
    }
    else {
        res.status(200).send({
            status: 'success',
            result: agg_res[0].user_count
        })
    }
})

router.get('/schedule_count', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    let pipeline = [
        {
            $count: "user_count"
        }
    ]

    let agg_res = await db.aggregateRecord("scheduled_message", pipeline)

    if (!agg_res || agg_res.length === 0) {
        res.status(500).send({
            status: 'failed'
        })
    }
    else {
        res.status(200).send({
            status: 'success',
            result: agg_res[0].user_count
        })
    }
})


module.exports = router