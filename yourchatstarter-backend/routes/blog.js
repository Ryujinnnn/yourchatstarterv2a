const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')

router.get('/newest_blog', async (req, res) => {
    let blog_res = await db.queryRecordLimit('blog', {}, 3, {content: 0}, {createOn: -1})
    if (blog_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            blog_list: blog_res
        })
    }
})

router.get('/all_blog', async (req, res) => {
    let blog_res = await db.queryRecord('blog', {}, {content: 0}, {createOn: -1})
    if (blog_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            blog_list: blog_res
        })
    }
})

router.post('/blog', async (req, res) => {
    let input = req.body;
    let tokenQuery = {
        articleId: input.articleId
    }
    let blog_res = await db.queryRecord('blog', tokenQuery)
    //console.log(blog_res)
    if (blog_res.length == 0) {
        res.send({
            status: 'failed'
        })
    }
    else {
        res.send({
            status: 'success',
            blog: blog_res[0]
        })
    }
})

module.exports = router