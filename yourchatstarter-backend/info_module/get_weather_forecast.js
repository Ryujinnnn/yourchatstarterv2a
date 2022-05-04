const fetch = require('node-fetch')

function forecast(locationString) {
    return new Promise(async (resolve, reject) => {
        const KEY = process.env.OPENWEATHER_TOKEN
        let url = encodeURI(`https://api.openweathermap.org/data/2.5/forecast?q=${locationString}&appid=${KEY}&lang=vi`)
            .replace('%C3%90', '%C4%90')                    //fix the letter Đ encode incorrectly
        console.log(url)
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in OpenWeather API")
            reject("Error in OpenWeather API")
            return
        }
        else {
            let obj = JSON.parse(await res.text())
            if (obj.cod !== '200' || obj.cnt !== 40) {
                reject('unexpected response from openweather API')
            }
            let pending_info = [obj.list[0], obj.list[3], obj.list[7], obj.list[15], obj.list[23]]
            let parse_result = []
            pending_info.forEach((entry) => {
                parse_result.push({
                    temp: entry.main.temp - 273,
                    temp_feel: entry.main.feels_like - 273,
                    max_temp: entry.main.temp_max - 273,
                    min_temp: entry.main.temp_min - 273,
                    humidity: entry.main.humidity,
                    desc: entry.weather[0].description,
                    icon: entry.weather[0].icon, 
                    wind: entry.wind || {speed: 0, deg: 0, gust: 0},
                    rain: entry.rain || { '1h': 0, '3h': 0},
                    snow: entry.snow || { '1h': 0, '3h': 0},
                    visibility: entry.visibility
                })
            })
            let final_res = {
                '3h': parse_result[0],
                '12h': parse_result[1],
                '24h': parse_result[2],
                '48h': parse_result[3],
                '72h': parse_result[4],
            }
            console.log(final_res)
            resolve(final_res)
        }
    })
}

module.exports = forecast