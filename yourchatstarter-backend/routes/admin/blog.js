const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')
const { ObjectID } = require('mongodb')

var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).slice(-2);
    }
    return colour;
  }

//TODO: hide this

router.get('/all_blog', verifyToken , async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let blog_query = {}
    let skip = 0
    const ENTRY_PER_PAGE = 20

    if (req.query.query) blog_query.title = {
        $regex: `.*${req.query.query}.*`, $options: 'i',
    }
    if (req.query.page) {
        let pageParse = parseInt(req.query.page)
        if (!Number.isNaN(pageParse)) {
            skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
        }
    }

    let err = null
    let blog_res = await db.queryRecordLimit('blog', blog_query, ENTRY_PER_PAGE, {content: 0}, {}, skip).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            blog_list: blog_res
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
    let blog_res = await db.queryRecord('blog', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else if (blog_res.length === 0) {
        res.send({
            status: "failed",
            desc: "blog not found"
        })
    } 
    else {
        res.send({
            status: 'success',
            blog: blog_res[0] 
        })
    }
})

router.post('/save_blog', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body;

    if (!input.title || !input.desc || !input.imageLink || !input.content) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let blog_query = {
        _id: new ObjectID(input._id) || new ObjectID()
    }

    let blog_action = {
        $set: {
            title: input.title,
            desc: input.desc,
            // tag: input.tag,
            imageLink: input.imageLink,
            content: input.content
        },
        $setOnInsert: {
            articleId: new ObjectID(),
            createOn: new Date()
        }
    }

    let pending_tag = []
    if (input.display_tag) {
        input.display_tag.forEach((val) => {
            pending_tag.push({name: val, color: stringToColour(val)})
        })
    }

    blog_action.$set.tag = pending_tag

    let err = null
    let blog_action_res = await db.editRecords("blog", blog_query, blog_action, {upsert: true}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Lưu bài viết thành công"
        })
    }
})

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
    let blog_res = await db.removeRecords('blog', {_id: new ObjectID(id)}).catch(e => err = e)

    if (err) {
        res.send({
            status: 'failed',
            desc: err
        })
    }
    else {
        res.send({
            status: 'success',
            desc: "Xóa bài viết thành công"
        })
    }
})

module.exports = router