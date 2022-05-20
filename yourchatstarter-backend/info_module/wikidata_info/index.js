const get = require('./get_info_api')
const {search, getEntitiesProperty }  = require('./search_api')

module.exports.wiki_query = (text) => {
    return new Promise(async (resolve, reject) => {
        let res = await search(text).catch((err) => {console.log(err), reject(err)})
        //console.dir(res, {depth: null})
        if (!res || res.search.length == 0) {
            reject("failed to find wiki result")
        }
        else {
            resolve(res.search)
        }
    })

}
module.exports.wiki_property = (property, entity) => {
    return new Promise(async (resolve, reject) => {
        let res = await getEntitiesProperty(property, entity).catch((err) => {console.log(err), reject(err)})
        //console.dir(res, {depth: null})
        if (!res) {
            reject("failed to find wiki result")
        }
        else {
            //get first result, if it contain value field, resolve answer from value and unit, else resolve item label
            let answer = ""
            if (res.value) {
                answer = `${res.value.toLocaleString('vi-VN')} ${(res.unitLabel && res.unitLabel !== "1")? res.unitLabel : ""}`
            }
            else {
                //additional check if its iso date
                let pattern = new RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)
                if (pattern.test(res.itemLabel)) {
                    answer = (new Date(res.itemLabel)).toLocaleDateString('vi-VN')
                }
                else {
                    answer = res.itemLabel
                }
            }
            resolve(answer)
        }
    })
}