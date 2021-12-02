const location_vn = require('./ner_data/geolocation_VN.json')
const fs = require('fs')

const locationKeys = Object.keys(location_vn);

let res = {
    options: {}
}
for (let i = 0; i < locationKeys.length; i += 1) {
    res.options[locationKeys[i]] = [locationKeys[i]]
}

let res_string = JSON.stringify(res, null, "  ")

fs.writeFileSync('res.json', res_string, {encoding: 'utf-8'})
console.log('done')