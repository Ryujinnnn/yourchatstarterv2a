const fs = require('fs')

const Canvas = require('canvas')

function initializeCanvas() {
    Canvas.registerFont('./@resource/Font/Roboto-Regular.ttf', { family: 'Roboto' })
    Canvas.registerFont('./@resource/Font/tahoma.ttf', { family: 'Tahoma' })
    Canvas.registerFont('./@resource/Font/tahoma-bold.ttf', { family: 'Tahoma', weight: 'bold' })
}

function drawImageSpecial(ctx, image, x, y, scale, rotation){
    ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.rotate(rotation);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore()
} 

function weather_infographic(data) {
    return new Promise(async (resolve, reject) => {
        const canvas = Canvas.createCanvas(360, 120)
        const ctx = canvas.getContext('2d')
        
        ctx.fillStyle = 'rgb(200, 200, 200)'
        ctx.fillRect(0, 0, 360, 120)
        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.font = 'Bold 18px Tahoma'
        ctx.fillText(`${data.name}`, 125, 35)
        
        // Draw line under text
        ctx.font = 'Bold 16px Tahoma'
        ctx.fillText(`${data.temp.toFixed(2)}°C`, 125, 69)

        ctx.fillText(`${data.humidity}%`, 159, 102)

        ctx.fillText(`${data.wind.speed}m/s`, 274, 102)
        
        ctx.strokeStyle = 'rgb(100, 100, 100)'

        ctx.strokeRect(1, 1, 359, 119)

        const image = await Canvas.loadImage(`./@resource/${data.icon}.png`)
        ctx.drawImage(image, 10, 10, 100, 100)
        const humid_image = await Canvas.loadImage(`./@resource/humidity.png`)
        ctx.drawImage(humid_image, 125, 86, 24, 24)
        const compass_image = await Canvas.loadImage(`./@resource/compass.png`)
        drawImageSpecial(ctx, compass_image, 248, 96, 0.046875, (-45 + data.wind.deg) * Math.PI / 180)

        const datauri = canvas.toDataURL()
        resolve(datauri)
        
        //console.log('<img src="' + canvas.toDataURL() + '" />')
    })
}

function forecast_infographic(data) {
    return new Promise(async (resolve, reject) => {
        const canvas = Canvas.createCanvas(400, 100)
        const ctx = canvas.getContext('2d')

        console.log(data)
        ctx.fillStyle = 'rgb(200, 200, 200)'
        ctx.fillRect(0, 0, 400, 100)

        ctx.strokeStyle = 'rgb(100, 100, 100)'
        ctx.strokeRect(1, 1, 399, 99)

        ctx.moveTo(80, 0)
        ctx.lineTo(80, 100)
        ctx.moveTo(160, 0)
        ctx.lineTo(160, 100)
        ctx.moveTo(240, 0)
        ctx.lineTo(240, 100)
        ctx.moveTo(320, 0)
        ctx.lineTo(320, 100)
        ctx.stroke()

        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.font = '14px Tahoma'
        ctx.fillText(`3h`, 35, 18)
        ctx.fillText(`12h`, 112, 18)
        ctx.fillText(`24h`, 190, 18)
        ctx.fillText(`48h`, 270, 18)
        ctx.fillText(`72h`, 350, 18)

        const image3h = await Canvas.loadImage(`./@resource/${data['3h'].icon}.png`)
        ctx.drawImage(image3h, 20, 30, 40, 40)

        const image12h = await Canvas.loadImage(`./@resource/${data['12h'].icon}.png`)
        ctx.drawImage(image12h, 100, 30, 40, 40)

        const image24h = await Canvas.loadImage(`./@resource/${data['24h'].icon}.png`)
        ctx.drawImage(image24h, 180, 30, 40, 40)

        const image48h = await Canvas.loadImage(`./@resource/${data['48h'].icon}.png`)
        ctx.drawImage(image48h, 260, 30, 40, 40)

        const image72h = await Canvas.loadImage(`./@resource/${data['72h'].icon}.png`)
        ctx.drawImage(image72h, 340, 30, 40, 40)

        ctx.font = '14px Tahoma'
        ctx.fillText(`${data['3h'].temp.toFixed(2)}°C`, 15, 90)
        ctx.fillText(`${data['12h'].temp.toFixed(2)}°C`, 95, 90)
        ctx.fillText(`${data['24h'].temp.toFixed(2)}°C`, 175, 90)
        ctx.fillText(`${data['48h'].temp.toFixed(2)}°C`, 255, 90)
        ctx.fillText(`${data['72h'].temp.toFixed(2)}°C`, 335, 90)

        const datauri = canvas.toDataURL()
        resolve(datauri)
    })
}

function crypto_infographic(data) {
    return new Promise(async (resolve, reject) => {
        const canvas = Canvas.createCanvas(420, 180)
        const frame_width = 360
        const frame_height = 150
        const ctx = canvas.getContext('2d')

        //console.log(data)
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect(0, 0, 420, 180)

        ctx.strokeStyle = 'rgb(100, 100, 100)'
        ctx.strokeRect(1, 1, 419, 179)

        //calculating scale
        const min_value = data.reduce(
            (prev_val, val) => (prev_val > val.low) ? val.low : prev_val,
            data[0].low
        );

        const max_value = data.reduce(
            (prev_val, val) => (prev_val < val.high) ? val.high : prev_val,
            data[0].high
        );

        //console.log(min_value, max_value)
        const step = parseFloat(((max_value - min_value) * 1.2 / 10).toPrecision(2))
        let precision_scale = 2
        while (min_value < (min_value - 0.1 * (max_value - min_value)).toPrecision(precision_scale) || max_value > (min_value - 0.1 * (max_value - min_value)).toPrecision(precision_scale) + step * 10) {
            precision_scale += 1
            if (precision_scale === 20) break
        } 
        let step_arr = []
        for (let i = 0; i <= 10; i++) {
            step_arr.push(parseFloat((min_value - 0.1 * (max_value - min_value)).toPrecision(precision_scale)) + step * i)
        }

        //console.log(step_arr)

        //parse the time series and high/low series (in reversed)
        let time_series = []
        let high_series = []
        let low_series = []
        data.forEach((val) => { time_series.push(val.close); time_series.push(val.open); high_series.push(val.high); low_series.push(val.low)})
        //reverse that shit
        time_series.reverse()
        low_series.reverse()
        high_series.reverse()

        //draw the chart frame (and label)
        ctx.strokeStyle = 'rgb(50, 50, 50)'
        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.font = '10px Tahoma'
        ctx.beginPath
        ctx.moveTo(50, 10)
        ctx.lineTo(50, 10 + frame_height)

        for (let i = 0; i < 10; i++) {
            ctx.fillText(`-${29 - i * 3}d`, 45 + i * 36, 25 + frame_height)
        }
        ctx.fillText(`0d`, 45 + 9 * 36 + 24, 25 + frame_height)

        step_arr.forEach((v, i) => {
            ctx.moveTo(50, 10 + frame_height - i * 15)
            ctx.lineTo(50 + frame_width, 10 + frame_height - i * 15)
            ctx.fillText(v.toPrecision(5), 10, 15 + frame_height - i * 15)
        })
        ctx.stroke()

        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgb(255, 128, 0)'

        //draw the line chart
        ctx.beginPath()

        time_series.forEach((x, i) => {
            if (i === 0) ctx.moveTo(50, 10 + (1 - (x - step_arr[0]) / (step_arr[10] - step_arr[0])) * frame_height)
            else ctx.lineTo( 50 + i / time_series.length * frame_width, 10 + (1 - (x - step_arr[0]) / (step_arr[10] - step_arr[0])) * frame_height)
        })

        ctx.stroke()

        //draw the high - low data point
        ctx.fillStyle = 'rgb(0, 180, 0)'
        high_series.forEach((x, i) => {
            ctx.fillRect(50 + 6 + 12 * i - 2, 10 + (1 - (x - step_arr[0]) / (step_arr[10] - step_arr[0])) * frame_height - 2, 4, 4)
        })

        ctx.fillStyle = 'rgb(255, 0, 0)'
        low_series.forEach((x, i) => {
            ctx.fillRect(50 + 6 + 12 * i - 2, 10 + (1 - (x - step_arr[0]) / (step_arr[10] - step_arr[0])) * frame_height - 2, 4, 4)
        })

        const datauri = canvas.toDataURL()
        resolve(datauri)
    })
}

// initializeCanvas()
// weather_infographic()

module.exports.init_canvas = initializeCanvas
module.exports.weather_current = weather_infographic
module.exports.forecast_infographic = forecast_infographic
module.exports.crypto_infographic = crypto_infographic