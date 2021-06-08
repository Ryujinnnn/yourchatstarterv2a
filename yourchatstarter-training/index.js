const INTENTS_ENDPOINT = 'https://api.wit.ai/intents'
const ENTITIES_ENDPOINT = 'https://api.wit.ai/entities'
const TRAITS_ENDPOINT = 'https://api.wit.ai/traits'
const UTTERANCES_ENDPOINT = 'https://api.wit.ai/utterances'


//console.log(entity.AMOUNT_OF_MONEY)
const fs = require('fs')

require('dotenv').config()

const fetch = require('node-fetch')

async function test() {
    let option = {
        method: 'GET', 
        headers: {
            'Authorization': 'Bearer ' + process.env.WITAI_API, 
        }, 
    }
    let res = await fetch(UTTERANCES_ENDPOINT + "?limit=40", option)
    console.log(await res.text())
}

function test2(array) {
    array.pop()
    return array
}

test()
//console.log(test2([1,2,3,4]))