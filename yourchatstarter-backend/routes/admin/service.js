const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')

//TODO: hide this

router.get('/all_service', async (req, res) => {
    let sv_res = await db.queryRecord('service', {}, {})
    //console.log(user_res)
    if (sv_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            sv_list: sv_res
        })
    }
})

module.exports = router