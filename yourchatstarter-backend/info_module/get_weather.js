function query(locationString) {
    return new Promise(async (resolve, reject) => {
        
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(locationString)}&appid=${process.env.OPENWEATHER_TOKEN}&lang=vi`
        let res = await fetch(url)
        //console.log(res)
        if (res.status != 200) {
            console.log("Error in OpenWeather API")
            reject("Error in OpenWeather API")
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