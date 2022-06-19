//TODO: communicate with python server at port 8000

const axios = require('axios').default;

module.exports.generate_text = function generate_text(input) {
    return new Promise((resolve, reject) => {
        console.log('calling generating model')
        axios.post('http://localhost:8000/generate', {text: input}, err => {
            console.log(err)
            reject("error in response generating server")
            return
        }).then(res => {
            //console.log(res.data)    
            resolve(res.data.response) 
        }).catch((e) => {
            reject("error in response generating server")
            return
        })
    })
}