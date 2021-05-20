require('dotenv').config()

const fetch = require('node-fetch')

async function test() {
    let option = {
        method: 'GET', 
        headers: {
            'Authorization': 'Bearer ' + process.env.WITAI_API, 
        }, 
    }
    let res = await fetch('https://api.wit.ai/intents', option)
    console.log(await res.text())
}

function test2(array) {
    array.pop()
    return array
}

//test()
console.log(test2([1,2,3,4]))