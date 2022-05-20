const canvas = require('canvas')

let img = canvas.createCanvas(400, 200)
let ctx = img.getContext('2d')

ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
ctx.fillRect(0, 0, 40, 20)


img.toDataURL()

