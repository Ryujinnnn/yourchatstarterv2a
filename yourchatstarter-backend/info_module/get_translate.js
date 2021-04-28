function translate(text, toLang, fromLang = "") {
    return new Promise(async (resolve, reject) => {
        // let resolvedFromLang = fromLang
        // if (!fromLang) {
        //     await detect(text).then(
        //         (lang_res) => {resolvedFromLang = lang_res},
        //         (e) => {reject(e)}
        //     )
        // }
        // if (!resolvedFromLang) return
        let encodedText = encodeURI(text)
        let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_TRANS_KEY}&text=${encodedText}&lang=${toLang}`
        if (fromLang) {
            url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YANDEX_TRANS_KEY}&text=${encodedText}&lang=${fromLang}-${toLang}`
        }
        //console.log(url)
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in Yandex API")
            reject("Error translating text in Yandex API")
            return
        }
        else {
            let obj = JSON.parse(await res.text())
            console.log(obj)
            let result = {
                translated_text: obj.text[0]
            }
            resolve(result)
        }
    })
}

module.exports = translate

function detect(text) {
    return new Promise(async (resolve, reject) => {
        let url = `https://translate.yandex.net/api/v1.5/tr/detect?key=${process.env.YANDEX_TRANS_KEY}&text=${text}`
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in Yandex API")
            reject("Error detecting language in Yandex API")
            return
        }
        else {
            let obj = JSON.parse(await res.text())
            let result = {
                language: obj.lang
            }
            resolve(result)
        }
    })
}