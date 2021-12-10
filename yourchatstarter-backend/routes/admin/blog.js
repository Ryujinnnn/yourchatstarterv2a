const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')
const { ObjectID } = require('mongodb')

//TODO: hide this

router.get('/all_blog', verifyToken , async (req, res) => {
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }
    let err = null
    let blog_res = await db.queryRecord('blog', {}, {content: 0}).catch(e => err = e)

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
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }

    let id = req.params.id

    if (!id || ObjectID.isValid(id)) {
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
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }

    let input = req.body;

    if (!input.title || !input.desc || !input.tag || !input.thumbnail_link || !input.content) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let blog_query = {
        _id: input.id || new ObjectID()
    }

    let blog_action = {
        $set: {
            title: input.title,
            desc: input.desc,
            tag: input.tag,
            imageLink: input.thumbnail_link,
            content: input.content
        },
        $setOnInsert: {
            articleId: new ObjectID(),
            createOn: new Date()
        }
    }

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
    if (!req.username) {
        res.status(401).send({
            status: "failed",
            desc: "token verification failed",
            user: return_user_result
        })
        return 
    }

    let id = req.params.id

    if (!id || ObjectID.isValid(id)) {
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