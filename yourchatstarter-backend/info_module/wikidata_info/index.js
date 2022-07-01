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
        let res_array = await getEntitiesProperty(property, entity).catch((err) => {console.log(err), reject(err)})
        // use array for result instead (due to the query limited at 10 entries, it can be incomplete - TODO: fix it somehow)
        //console.dir(res, {depth: null})
        if (!res_array || res_array.length === 0) {
            reject("failed to find wiki result")
        }
        else {
            //get first result, if it contain value field, resolve answer from value and unit, else resolve item label
            let answer = ""
            let res = res_array[0]
            if (res.value) {
                answer = `${res.value.toLocaleString('vi-VN')} ${(res.unitLabel && res.unitLabel !== "1")? res.unitLabel : ""}`
            }
            else {
                res_array.forEach((res, index) => {
                    //additional check if its iso date
                    let pattern = new RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)
                    if (pattern.test(res.itemLabel)) {
                        answer += (new Date(res.itemLabel)).toLocaleDateString('vi-VN')
                    }
                    //check if this is a url
                    else if (res.itemLabel.startsWith("http://") || res.itemLabel.startsWith("https://")) {
                        //additional check if its an image
                        if (res.itemLabel.endsWith(".gif") || res.itemLabel.endsWith(".png") || res.itemLabel.endsWith(".jpg") || res.itemLabel.endsWith(".jpeg") || res.itemLabel.endsWith(".svg")) {
                            answer += `![wiki_image](${res.itemLabel})`
                        }
                        else {
                            answer += ((index !== 0)? ", ": "") +  `[đường dẫn này](${res.itemLabel})`
                        }
                    }
                    else {
                        answer += ((index !== 0)? ", ": "") + res.itemLabel
                    }
                })

                //get supplement image for the first result (if present)
                if (res.imageLabel) {
                    if (res.imageLabel.endsWith(".gif") || res.imageLabel.endsWith(".png") || res.imageLabel.endsWith(".jpg") || res.imageLabel.endsWith(".jpeg") || res.imageLabel.endsWith(".svg")) {
                        answer += ` ![${res.itemLabel}](${res.imageLabel})`
                    }
                    else {
                        answer += `, [xem tại đường dẫn này](${res.imageLabel})`
                    }
                }
            }
            resolve(answer)
        }
    })
}