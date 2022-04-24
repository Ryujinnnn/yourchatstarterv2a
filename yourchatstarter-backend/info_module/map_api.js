const { default: axios } = require("axios")

function map_info(input) {

}

function nominating_search(input) {
    return new Promise(async (resolve, reject) => {
        axios.get(encodeURI(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`), {}, 
            err => {
                console.log(err)
                reject(err)
            })
            .then(res => {
                let out = res.data[0]
                console.log(out)
                resolve(out)
            })
    })
}

//nominating_search('a')

module.exports = nominating_search