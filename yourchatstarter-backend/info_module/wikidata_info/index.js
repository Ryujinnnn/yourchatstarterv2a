const get = require('./get_info_api')
const search = require('./search_api')

module.exports.wiki_query = (text) => {
    return new Promise(async (resolve, reject) => {
        let res = await search(text)
        //console.dir(res, {depth: null})
        if (!res || res.search.length == 0) {
            reject()
        }
        else {
            resolve(res.search)
        }
    })

}