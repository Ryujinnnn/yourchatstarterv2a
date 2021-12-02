const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')

//TODO: hide this

router.get('/all_user', async (req, res) => {
    let user_res = await db.queryRecord('user', {}, {hashed_password: 0})
    //console.log(user_res)
    if (user_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            user_list: user_res
        })
    }
})


router.post('/save_user', async (req, res) => {
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