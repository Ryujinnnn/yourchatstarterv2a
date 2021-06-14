const { default: axios } = require('axios')
const WBK = require('wikibase-sdk')
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

module.exports = function get(entity_id) {
    const url = wdk.getEntities({
        ids: [entity_id], 
        languages: [ 'vi', 'en'],
        props: [ 'info', 'claims' ], // returns all data if not specified
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
