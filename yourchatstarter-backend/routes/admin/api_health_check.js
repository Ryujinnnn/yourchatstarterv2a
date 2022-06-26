const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/verify_token')

const get_covid_info = require('../../info_module/covid_info/get_covid_info')
const { get_ping } = require('../../info_module/covid_info')
const { get_knowledge } = require('../../info_module/google_info/get_knowledge')
const { search } = require('../../info_module/wikidata_info/search_api')
const convert = require('../../info_module/get_exchange')
const { get_news } = require('../../info_module/get_news')
const get_stock = require('../../info_module/get_stockmarket')
const translate = require('../../info_module/get_translate')
const query_weather = require('../../info_module/get_weather')

function tryEndpoint() {
    return new Promise(async (resolve, reject) => {
        let res = {
            exchange: false,
            news: false,
            stock: false,
            translate: false,
            weather: false,
            google: false,
            wiki: false,
            covid: false,
            mongodb: true,
            witai: false,
        }
        if (await get_ping().catch((e) => {})) res.covid = true
        if (await get_knowledge("USA").catch((e) => {})) res.google = true
        if (await search("việt nam").catch((e) => {})) res.wiki = true
        if (await convert(1, "USD", "VND").catch((e) => {})) res.exchange = true
        if (await get_news().catch((e) => {})) res.news = true
        if (await get_stock("AMZN").catch((e) => {})) res.stock = true
        if (await translate("hello", "vi").catch((e) => {})) res.translate = true
        if (await query_weather("Hà Nội").catch((e) => {})) res.weather = true

        resolve(res)
    })
}

router.get('/all', verifyToken , async (req, res) => {
    if (!req.user_id || !req.is_admin) {
        res.status(401).send({
            status: 'failed',
            desc: 'unauthorized'
        })
        return
    }
    
    let err = null
    let service_res = await tryEndpoint().catch((e) => {err = e})

    if (err) {
        res.send({
            status: 'failed',
            service_res: {}
        })
        return
    }
    res.send({
        status: 'success',
        service_res: service_res
    })
})

module.exports = router