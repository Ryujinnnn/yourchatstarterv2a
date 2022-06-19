// use google knowledge graph
// rate limit at 100k queries per months
// Endpoint: https://kgsearch.googleapis.com/v1/entities:search

module.exports.get_knowledge = (queries) => {
    return new Promise(async (resolve, reject) => {
        let url = `https://kgsearch.googleapis.com/v1/entities:search?key=${process.env.GOOGLE_KG_KEY}&languages=vi&query=${encodeURI(queries)}&limit=5`
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in Google Knowledge Graph API")
            reject("Error in Google Knowledge Graph API")
            return
        }
        else {
            let obj = JSON.parse(await res.text())
            console.dir(obj, {depth: null})
            resolve(obj)
        }
    })
}