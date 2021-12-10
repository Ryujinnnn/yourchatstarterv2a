const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')

//TODO: hide this

router.get('/all_bill', verifyToken, async (req, res) => {
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }
    let bill_res = await db.queryRecord('billing', {})
    //console.log(user_res)
    if (bill_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            bill_list: bill_res
        })
    }
})

router.get('/from_id/:id', verifyToken, async (req, res) => {
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }
})

router.post('/save_bill', verifyToken, async (req, res) => {
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }

    res.status(501).send({
        status: "failed",
        desc: "endpointhave yet been implemented"
    })
})

router.delete('/from_id/:id', async (req, res) => {
    res.status(501).send({
        status: "failed",
        desc: "endpointhave yet been implemented"
    })
})

module.exports = router

