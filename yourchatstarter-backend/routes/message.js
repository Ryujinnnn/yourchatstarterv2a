const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
    res.send({ express: 'Hello From Express' })
})

module.exports = router