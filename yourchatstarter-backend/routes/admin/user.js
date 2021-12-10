const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')

//TODO: hide this

router.get('/all_user', verifyToken, async (req, res) => {
    let user_res = await db.queryRecord('user', {}, {hashed_password: 0}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            blog: blog_res
        })
    }
})

router.get('/from_id/:id', verifyToken, async (req, res) => {
    res.status(501).send({
        status: "failed",
        desc: "endpointhave yet been implemented"
    })
})


router.post('/save_user', verifyToken, async (req, res) => {
    res.status(501).send({
        status: "failed",
        desc: "endpointhave yet been implemented"
    })
})

router.delete('/from_id/:id', verifyToken, async (req, res) => {
    res.status(501).send({
        status: "failed",
        desc: "endpointhave yet been implemented"
    })
})

module.exports = router