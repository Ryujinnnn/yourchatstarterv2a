const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { updateServicePermission } = require('../../routine/update_permission')
const { verifyToken } = require('../middleware/verify_token')

//TODO: hide this

router.get('/all_service', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

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

router.post('/save_service', verifyToken, async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }

    let input = req.body;

    if (!input.config) {
        res.status(400).send({
            status: "failed",
            desc: "bad request"
        })
        return 
    }

    let free_config = input.config.find((val) => val.name === "basic")
    let standard_config = input.config.find((val) => val.name === "standard")
    let premium_config = input.config.find((val) => val.name === "premium")

    console.log(free_config, standard_config, premium_config)

    let config_query = {}
    let config_action = {}
    if (free_config) {
        config_query = {
            name: "basic"
        }
        config_action = {
            $set: {
                ask_calc: trueIfUndefined(free_config.ask_calc ),
                ask_covid: trueIfUndefined(free_config.ask_covid ),
                ask_crypto: trueIfUndefined(free_config.ask_crypto ),
                ask_conversion: trueIfUndefined(free_config.ask_conversion ),
                ask_exchange_rate: trueIfUndefined(free_config.ask_exchange_rate ),
                ask_news: trueIfUndefined(free_config.ask_news ),
                ask_stock: trueIfUndefined(free_config.ask_stock ),
                ask_weather: trueIfUndefined(free_config.ask_weather ),
                req_translate: trueIfUndefined(free_config.req_translate ),
                wiki_fallback: trueIfUndefined(free_config.wiki_fallback ),
                google_fallback: trueIfUndefined(free_config.google_fallback ),
            }
        }

        let res = await db.editRecords("service", config_query, config_action, {upsert: true}).catch((e) => {console.log(e)})
        if (!res) {
            res.status(500).send({
                status: "failed",
                desc: "internal server error"
            })
            return
        }
    }

    function trueIfUndefined(input) {
        return (input === undefined || input === null) ? true : input
    }

    if (standard_config) {
        config_query = {
            name: "standard"
        }
        config_action = {
            $set: {
                ask_calc: trueIfUndefined(standard_config.ask_calc ),
                ask_covid: trueIfUndefined(standard_config.ask_covid ),
                ask_crypto: trueIfUndefined(standard_config.ask_crypto ),
                ask_conversion: trueIfUndefined(standard_config.ask_conversion ),
                ask_exchange_rate: trueIfUndefined(standard_config.ask_exchange_rate ),
                ask_news: trueIfUndefined(standard_config.ask_news ),
                ask_stock: trueIfUndefined(standard_config.ask_stock ),
                ask_weather: trueIfUndefined(standard_config.ask_weather ),
                req_translate: trueIfUndefined(standard_config.req_translate ),
                wiki_fallback: trueIfUndefined(standard_config.wiki_fallback ),
                google_fallback: trueIfUndefined(standard_config.google_fallback ),
            }
        }

        let res = await db.editRecords("service", config_query, config_action, {upsert: true}).catch((e) => {console.log(e)})
        if (!res) {
            res.status(500).send({
                status: "failed",
                desc: "internal server error"
            })
            return
        }
    }

    if (premium_config) {
        config_query = {
            name: "premium"
        }
        config_action = {
            $set: {
                ask_calc: trueIfUndefined(premium_config.ask_calc ),
                ask_covid: trueIfUndefined(premium_config.ask_covid ),
                ask_crypto: trueIfUndefined(premium_config.ask_crypto ),
                ask_conversion: trueIfUndefined(premium_config.ask_conversion ),
                ask_exchange_rate: trueIfUndefined(premium_config.ask_exchange_rate ),
                ask_news: trueIfUndefined(premium_config.ask_news ),
                ask_stock: trueIfUndefined(premium_config.ask_stock ),
                ask_weather: trueIfUndefined(premium_config.ask_weather ),
                req_translate: trueIfUndefined(premium_config.req_translate ),
                wiki_fallback: trueIfUndefined(premium_config.wiki_fallback ),
                google_fallback: trueIfUndefined(premium_config.google_fallback ),
            }
        }

        let res = await db.editRecords("service", config_query, config_action, {upsert: true}).catch((e) => {console.log(e)})
        if (!res) {
            res.status(500).send({
                status: "failed",
                desc: "internal server error"
            })
            return
        }
    }

    updateServicePermission()

    res.status(200).send({
        status: "success",
        desc: "Lưu cấu hình thành công, thay đổi sẽ được thực hiện trong tối đa 2 phút tới"
    })
})

router.delete('/from_id/:id', async (req, res) => {
    res.status(501).send({
        status: "failed",
        desc: "endpoint have yet been implemented"
    })
})


module.exports = router