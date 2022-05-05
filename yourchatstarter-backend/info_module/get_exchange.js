function convert(amount, from_currency, to_currency) {
    return new Promise(async (resolve, reject) => {

        //LEGACY CODE USING EXCHANGERATE-API
        // let legacy_url = `https://v6.exchangerate-api.com/v6/${process.env.FOREX_API}/pair/${from_currency}/${to_currency}/${amount}`
        // let res = await fetch(legacy_url)
        // //console.log(res)
        // if (res.status != 200) {
        //     console.log("Error in ForeignExchange API")
        //     reject("Error in ForeignExchange API")
        //     return
        // }
        // else {
        //     let obj = JSON.parse(await res.text())
        //     let result = {
        //         result: obj.conversion_result,
        //         rate: obj.conversion_rate,
        //         last_update: obj.time_last_update_unix
        //     }
        //     resolve(result)
        // }
        const ENDPOINT = `https://api.twelvedata.com`

        let url = `${ENDPOINT}/time_series?symbol=${from_currency}/${to_currency}&interval=1day&apikey=${process.env.TWELVEDATA_API}`
        let res = await fetch(url)
        let return_res = {
            result: 0,
            forexIndex: 0,
            forexChangeRaw: 0,
            forexChangePercent: 0,
            timeSeries: []
        }
        //console.log(res)
        if (res.status != 200) {
            resolve(return_res)
            return
        }
        let obj = await res.json()
        //console.log(obj)
        if (obj.status != 'ok') {
            resolve(return_res)
            return
        }
        return_res.forexIndex = parseFloat(obj.values[0].close)
        let pastIntervalIndex = parseFloat(obj.values[1].close)
        return_res.forexChangeRaw = return_res.forexIndex - pastIntervalIndex
        return_res.forexChangePercent = ((return_res.forexIndex / pastIntervalIndex) - 1) * 100
        return_res.timeSeries = obj.values
        return_res.result = amount * return_res.forexIndex
        //console.log(return_res)
        resolve(return_res)  
        
    })
}

module.exports = convert