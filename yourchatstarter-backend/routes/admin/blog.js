const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')

//TODO: hide this

router.get('/all_blog', async (req, res) => {
    let blog_res = await db.queryRecord('blog', {}, {content: 0})
    //console.log(user_res)
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

module.exports = router