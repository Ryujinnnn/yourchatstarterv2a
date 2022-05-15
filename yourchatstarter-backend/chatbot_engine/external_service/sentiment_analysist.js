//TODO: communicate with python server at port 8000

const axios = require('axios').default;

export function get_sentiment(input) {
    axios.post('localhost:8000/classify', {text: input}, err => {
        console.log(err)
    }).then(res => {
        console.log(res.data)     
    })
}