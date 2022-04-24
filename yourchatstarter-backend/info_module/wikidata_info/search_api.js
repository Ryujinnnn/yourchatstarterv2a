const { default: axios } = require('axios')
const WBK = require('wikibase-sdk')
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

function search(keyword) {
    const url = wdk.searchEntities({
        search: keyword,
        format: 'json',
        language: 'vi',
        limit: 10,
    })

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })

}

async function test() {
    const res = await search('bán kinh')
    console.log(res)
}

module.exports = search