function convert(amount, from_currency, to_currency) {
    return new Promise(async (resolve, reject) => {
        let url = `https://v6.exchangerate-api.com/v6/${process.env.FOREX_API}/pair/${from_currency}/${to_currency}/${amount}`
        //console.log(url)
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in ForeignExchange API")
            reject("Error in ForeignExchange API")
            return
        }
        else {
            let obj = JSON.parse(await res.text())
            let result = {
                result: obj.conversion_result,
                rate: obj.conversion_rate,
                last_update: obj.time_last_update_unix
            }
            resolve(result)
        }
    })
}

module.exports = convert