//TODO: communicate with python server at port 8000

const axios = require('axios').default;

module.exports.get_sentiment = function get_sentiment(input) {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:8000/classify', {text: input}, err => {
            console.log(err)
            reject("error in sentiment analysis server")
            return
        }).then(res => {
            //console.log(res.data)    
            resolve(res.data) 
        }).catch((e) => {
            reject("error in sentiment analysis server")
            return
        })
    })
}