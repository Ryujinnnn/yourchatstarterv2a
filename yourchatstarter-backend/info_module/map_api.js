const { default: axios } = require("axios")

const vehicle_lookup = {
    'car': 'driving-car',
    'hgv': 'driving-hgv',
    'bicycle': 'cycling-regular',
    'road-bicycle': 'cycling-road',
    'mountain-bicycle': 'cycling-mountain',
    'electric-bicycle': 'cycling-electric',
    'walk': 'foot-walking',
    'hike': 'foot-hiking',
    'wheelchair': 'wheelchair',
}

function nominating_search(input) {
    return new Promise(async (resolve, reject) => {
        axios.get(encodeURI(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`), {}, 
            err => {
                console.log(err)
                reject(err)
            })
            .then(res => {
                let out = res.data[0]
                console.log(res.data[0] || {})
                resolve(out)
            })
    })
}

function routing_fetch(latX, lonX, latY, lonY, type = 'driving-car') {
    return new Promise(async (resolve, reject) => {
        axios.get(encodeURI(`https://api.openrouteservice.org/v2/directions/${type}?api_key=${process.env.OPENROUTE_API}&start=${latX},${lonX}&end=${latY},${lonY}`), {}, 
            err => {
                console.log(err)
                reject(err)
            })
            .then(res => {
                let out = res.data
                resolve(out)
            })
    })
}

function routing_search(locationA, locationB, type = "car") {
    return new Promise(async (resolve, reject) => {
        const resA = await nominating_search(locationA).catch(err => {
            console.log(err)
            reject('failed to search for source location')
        })
        if (!resA || resA.length === 0) {
            reject('failed to search for source location')
        }
        const latA = resA.lat
        const lonA = resA.lon
        const resB = await nominating_search(locationB).catch(err => {
            console.log(err)
            reject('failed to search for destination location')
        })
        if (!resB || resB.length === 0) {
            reject('failed to search for destination location')
        }
        const latB = resB.lat
        const lonB = resB.lon

        const req_type = vehicle_lookup[type] || 'car'

        const route_res = await routing_fetch(latA, lonA, latB, lonB, req_type).catch(err => {
            console.log(err)
            reject('failed to search for source location')
        })

        console.log(route_res)
        resolve(route_res)
    })
}

//routing_search('bệnh viện hoàn mỹ thủ đức', 'bệnh viện nhi đồng 2', 'car')

//nominating_search('a')

module.exports = nominating_search