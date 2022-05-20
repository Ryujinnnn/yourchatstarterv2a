const express = require('express')
const router = express.Router()
const db = require('../../database/database_interaction')
const { verifyToken } = require('../middleware/verify_token')

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

router.post('/save_service', verifyToken, async (req, res) => {
    if (!req.user_id) {
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
                ask_calc: free_config.ask_calc || false,
                ask_covid: free_config.ask_covid || false,
                ask_crypto: free_config.ask_crypto || false,
                ask_exchange_rate: free_config.ask_exchange_rate || false,
                ask_news: free_config.ask_news || false,
                ask_stock: free_config.ask_stock || false,
                ask_weather: free_config.ask_weather || false,
                req_translate: free_config.req_translate || false,
                wiki_fallback: free_config.wiki_fallback || false,
                google_fallback: free_config.google_fallback || false,
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

    if (standard_config) {
        config_query = {
            name: "standard"
        }
        config_action = {
            $set: {
                ask_calc: standard_config.ask_calc || false,
                ask_covid: standard_config.ask_covid || false,
                ask_crypto: standard_config.ask_crypto || false,
                ask_exchange_rate: standard_config.ask_exchange_rate || false,
                ask_news: standard_config.ask_news || false,
                ask_stock: standard_config.ask_stock || false,
                ask_weather: standard_config.ask_weather || false,
                req_translate: standard_config.req_translate || false,
                wiki_fallback: standard_config.wiki_fallback || false,
                google_fallback: standard_config.google_fallback || false,
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
                ask_calc: premium_config.ask_calc || false,
                ask_covid: premium_config.ask_covid || false,
                ask_crypto: premium_config.ask_crypto || false,
                ask_exchange_rate: premium_config.ask_exchange_rate || false,
                ask_news: premium_config.ask_news || false,
                ask_stock: premium_config.ask_stock || false,
                ask_weather: premium_config.ask_weather || false,
                req_translate: premium_config.req_translate || false,
                wiki_fallback: premium_config.wiki_fallback || false,
                google_fallback: premium_config.google_fallback || false,
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