const sample_keyword = {
    keyword: "Paris",
    symnonyms: ["Paris", "City of Light", "Capital of France"]
}

const ENTITY_NAME = 'stock_code'
const KEYWORD_ENDPOINT = `https://api.wit.ai/entities/${ENTITY_NAME}/keywords`

const stock_data = require('./training_data/json/stocks_nasdaq.json')
require('dotenv').config()

const fetch = require('node-fetch')

function resolve_data(data) {
    let res = []
    data.forEach((val) => {
        const keyword = {
            keyword: val.Symbol,
            synonyms: [val.Symbol]
        }
        res.push(keyword)
    })
    //console.dir(data, {depth: null})
    return res
}

async function add_keyword(entry) {
    let option = {
        method: 'POST', 
        headers: {
            'Content-Type': "application/json",
            'Authorization': 'Bearer ' + process.env.WITAI_API, 
        }, 
        body: JSON.stringify(entry)
    }
    //console.log(option.body)
    let res = await fetch(KEYWORD_ENDPOINT , option)
    console.log('entry ' + JSON.stringify(entry) + ' sent')
}

async function test() {
    let data = resolve_data(stock_data)
    console.log(data)
    var index = 0
    setInterval(() => {add_keyword(data[index]); index += 1}, 500)
    //console.log(await res.text())
}

test()