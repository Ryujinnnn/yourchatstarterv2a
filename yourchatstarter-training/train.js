const UTTERANCES_ENDPOINT = 'https://api.wit.ai/utterances'
require('dotenv').config()

const fetch = require('node-fetch')

//data as array of simplìfied utterances
function resolve_simple_data(data) {
    data.forEach((val) => {
        val.entities.forEach((e_val) => {
            let start = val.text.indexOf(e_val.body)
            let end = start + e_val.body.length
            e_val.start = start
            e_val.end = end
            e_val.entities = []
            if (e_val.value) {e_val.body = e_val.value}
        })
        
        val.intent = training_data.name
        
    })
    //console.dir(data, {depth: null})
    return data
}

async function test() {
    data = resolve_simple_data(training_data.data_simple)
    let option = {
        method: 'POST', 
        headers: {
            'Content-Type': "application/json",
            'Authorization': 'Bearer ' + process.env.WITAI_API, 
        }, 
        body: JSON.stringify(data)
    }
    //console.log(option.body)
    let res = await fetch(UTTERANCES_ENDPOINT , option)
    console.log(await res.text())
}

test()