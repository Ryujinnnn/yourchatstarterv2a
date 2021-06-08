const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')

//TODO: hide this

router.get('/all_bill', async (req, res) => {
    let bill_res = await db.queryRecord('billing', {}, {content: 0})
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

module.exports = router