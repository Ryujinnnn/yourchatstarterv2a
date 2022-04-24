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

// initializeCanvas()
// weather_infographic()

module.exports.init_canvas = initializeCanvas
module.exports.weather_current = weather_infographic