function query(locationString) {
    return new Promise(async (resolve, reject) => {
        
        let url = encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${(locationString)}&appid=${process.env.OPENWEATHER_TOKEN}&lang=vi`)
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
            let result = {
                temp: obj.main.temp - 273,
                temp_feel: obj.main.feels_like - 273,
                max_temp: obj.main.temp_max - 273,
                min_temp: obj.main.temp_min - 273,
                desc: obj.weather[0].description
            }
            resolve(result)
        }
    })
}

module.exports = query