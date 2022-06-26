const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')
const { ObjectID } = require('mongodb')

//TODO: hide this

router.get('/all_bill', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    
    let bill_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = 20

    if (req.query.query) bill_query.username = {
        $regex: `.*${req.query.query}.*`, $options: 'i',
    }
    if (req.query.page) {
        let pageParse = parseInt(req.query.page)
        if (!Number.isNaN(pageParse)) {
            skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
        }
    }

    let err = null
    let bill_res = await db.queryRecordLimit('billing', bill_query, ENTRY_PER_PAGE, {}, {}, skip).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
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
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let id = req.params.id

    if (!id || !ObjectID.isValid(id)) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let err = null
    let bill_res = await db.queryRecord('billing', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.status(500).send({
            status: 'failed',
            desc: 'internal server error'
        })
    }
    else if (bill_res.length === 0) {
        res.send({
            status: "failed",
            desc: "bill not found"
        })
    } 
    else {
        res.send({
            status: 'success',
            bill: bill_res[0] 
        })
    }
})

router.post('/save_bill', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body;

    if (!input.username || !input.plan_name || !input.amount) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let bill_query = {
        _id: new ObjectID(input._id) || new ObjectID()
    }

    let bill_action = {
        $set: {
            username: input.username,
            created_at: new Date(input.created_at) || new Date() ,
            plan_name: input.plan_name,
            amount: input.amount,
        },
    }

    let err = null
    let bill_action_res = await db.editRecords("billing", bill_query, bill_action, {upsert: true}).catch(e => err = e)

    if (bill_action_res.upsertedCount > 0) {
        updateUserTier(input.username, input.plan_name)
    }

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Lưu hóa đơn thành công"
        })
    }
})

async function updateUserTier(username, plan_name) {

    let user_query = {
        username: username
    }
    let user_query_result = await db.queryRecord("user", user_query)
    if (user_query_result.length == 0) {
        console.log("ERROR: can't find any user match the completed bill's session")
        return
    }
    let number_of_date_to_add = 0

    switch (plan_name) {
        case 'standard': number_of_date_to_add = 30; break;
        case 'premium': number_of_date_to_add = 30; break;
        case 'lifetime': number_of_date_to_add = 7200; break;
        default: number_of_date_to_add = 0;
    }
    let today = new Date()
    let new_expire_date = today.setDate((today > user_query_result[0].paid_valid_until)? today.getDate() + number_of_date_to_add : user_query_result[0].paid_valid_until.getDate() + number_of_date_to_add)
    //update user
    let update_user_action = {
        $set: {
            paid_valid_until: new Date(new_expire_date),
            plan: plan_name
        }
    }

    let err = null
    let update_user_result = await db.editRecords("user", user_query, update_user_action).catch(e => err = e)

    if (err) {
        console.log("ERROR: failed to update user, please do not delete billing info for support referencing")
    }
}

router.delete('/from_id/:id', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let id = req.params.id

    if (!id || !ObjectID.isValid(id)) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let err = null
    let bill_res = await db.removeRecords('billing', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Xóa hóa đơn thành công"
        })
    }
})

module.exports = router

