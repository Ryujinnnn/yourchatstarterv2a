const { default: axios } = require('axios')
const fs = require('fs')

const data = fs.readFileSync('./geoplanet_data_7.10.0/geoplanet_places_VN.tsv', {encoding: 'utf8'})

const lines = data.split('\n')
let result = {}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function run() {
    for (const val of lines) {
        const comp = val.split('\t')
        if (comp[4] == "State" || comp[4] == "Town") {
            comp[2] = comp[2].replace(/\"/g, "")
            let escapedName = encodeURI(comp[2])
            result[comp[2]] = {
                uri: escapedName
            } 
            console.log(comp[2])
            try {
                let response = await axios.get(`https://nominatim.openstreetmap.org/search/${escapedName}?format=json&limit=1&countrycodes=VN&accept-language=vi-VN`)
                let obj = response.data
                //console.log(obj)
                result[comp[2]] = {
                    uri: escapedName,
                    lat: obj[0].lat,
                    lon: obj[0].lon,
                    name: obj[0].display_name
                } 
            }
            catch (err) {
                console.log("error in request")
            }
            console.log(result[comp[2]])
            await sleep(5000)
        }
    }
    
    console.log(result)
    fs.writeFileSync('result.json', JSON.stringify(result))
}

run()