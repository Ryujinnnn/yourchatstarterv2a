const { default: axios } = require('axios')
const WBK = require('wikibase-sdk')
const wdk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

const property_lookup = require('./property_list.json')

function search(keyword) {
    const url = wdk.searchEntities({
        search: keyword,
        format: 'json',
        language: 'vi',
        limit: 1,
    })

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => {
                //console.log(res.data)
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })

}

function cirrusSearch(keyword, property = undefined) {
    let url = wdk.cirrusSearchPages({
        search: keyword,
        format: 'json',
        language: 'vi',
        limit: 10,
        sort: 'create_timestamp_asc',
    })

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => {
                //console.dir(res.data, {depth: null})
                resolve(res.data.query)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

function searchProperty(keyword) {
    const url = wdk.searchEntities({
        search: keyword,
        format: 'json',
        language: 'vi',
        limit: 1,
        type: 'property'
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

function getEntitiesProperty(property, entity) {

    return new Promise(async (resolve, reject) => {

        //attempt at local lookup table first (since limited property count)
        let temp_property = property.toLowerCase()
        let res1 = property_lookup.find(val => val.name === temp_property)
        let property_id = ""
        if (!res1) {
            res1 = await searchProperty(property)
            if (!res1 || res1.search.length === 0) {
                reject("cant find property")
                return
            }
            property_id = res1.search[0].id
        }
        else property_id = res1.id
        const res2 = await search(entity)
        let entity_id = ""
        if (!res2 || res2.search.length === 0) {
            const res3 = await cirrusSearch(entity, property_id)
            if (!res3 || res3.search.length === 0) {
                reject("cant find entity")
                return
            }
            else {
                entity_id = res3.search[0].title
            }
        }
        else {
            entity_id = res2.search[0].id
        }
        console.log(property_id, entity_id)

        const sparql = `
        SELECT ?value ?unitLabel ?itemLabel ?imageLabel WHERE { 
            {
                wd:${entity_id} wdt:${property_id} ?item.
                OPTIONAL {
                    ?item wdt:P18 ?image.
                }
            }
            UNION {
                wd:${entity_id} p:${property_id} ?statement.
                ?statement psv:${property_id} ?valuenode.
                ?valuenode wikibase:quantityAmount ?value.
                OPTIONAL {
                    ?valuenode wikibase:quantityUnit ?unit.
                }
            }
            
            SERVICE wikibase:label { 
              bd:serviceParam wikibase:language "vi,en". 
            }
        }
        ORDER BY DESC(?unitLabel)
        LIMIT 10
        `
        const url = wdk.sparqlQuery(sparql)

        axios.get(url)
            .then((res) => {
                let simplify_res = wdk.simplify.sparqlResults(res.data)
                //console.dir(simplify_res, { depth: null })
                //console.log(res.data.entities['Q2'])
                if (simplify_res.length === 0) {
                    reject('cant find info')
                    return
                }
                resolve(simplify_res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

//test()

// getEntitiesProperty("bán kính", "trái đất").catch((e) => {console.log(e)})
// getEntitiesProperty("dân số", "việt nam").catch((e) => {console.log(e)})
// getEntitiesProperty("diện tích", "liên bang nga").catch((e) => {console.log(e)})
// getEntitiesProperty("cân nặng", "sao hỏa").catch((e) => {console.log(e)})
// getEntitiesProperty("tác giả", "tiểu thuyết chạng vạng").catch((e) => {console.log(e)})
// getEntitiesProperty("tác giả", "harry potter").catch((e) => {console.log(e)})
// getEntitiesProperty("thời gian", "barrack obama").catch((e) => {console.log(e)})

module.exports.search = search
module.exports.searchProperty = searchProperty
module.exports.cirrusSearch = cirrusSearch
module.exports.getEntitiesProperty = getEntitiesProperty