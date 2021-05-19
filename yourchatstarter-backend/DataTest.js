var data = require('./info_module/scribble.json')

console.dir(data)
Object.values(data.entities).forEach((v) => {
    console.log(v)
})
