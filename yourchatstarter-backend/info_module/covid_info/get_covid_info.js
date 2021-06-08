const fs = require('fs')
const cheerio = require('cheerio')
const moment = require('moment');

module.exports.get_indivdual_case = () => {
    return new Promise(async (resolve, reject) => {
        let data = fs.readFileSync('cases.json')
        let all_case = JSON.parse(data)
        resolve(all_case)
    })
}

module.exports.get_stat = (location = "") => {
    return new Promise(async (resolve, reject) => {
        let data = fs.readFileSync('stats.json')
        let stat = JSON.parse(data)
        let res = {}
        if (!location) {
            res = stat['cả nước']
        }
        else {
            res = stat[location.toLowerCase()]
            if (!res) {
                reject("not found")
                return
            }
        }
        resolve(res)
    })
}


//stat by last 10 day (not up-to-date with individual stat)
module.exports.get_last_10_day_stat = () => {

    return new Promise(async (resolve, reject) => {
        let data = fs.readFileSync('src.html')
        const $ = cheerio.load(data);
        let values = [] 
        $('.portlet-content-container .portlet-body script:not([src])').each((index, ele) => {
            let script_content = $(ele).toString()
            if (script_content.includes("line-chart-canhiem-web")) {
                let matched = script_content.match(/data :(\[.*?\])/g)
                let entry = {
                    name: 'case',
                    data: JSON.parse(matched[0].split(':')[1])
                }
                let entry2 = {
                    name: 'recovered',
                    data: JSON.parse(matched[1].split(':')[1])
                }
                let entry3 = {
                    name: 'death',
                    data: JSON.parse(matched[2].split(':')[1])
                }
                values.push([entry, entry2, entry3])
            }
        })
        resolve(values)
    })
}

module.exports.get_announcement = () => {

    return new Promise(async (resolve, reject) => {
        let tl_data = fs.readFileSync('timeline.html')

        const $ = cheerio.load(tl_data) 

        let announcement = []
        $('.timeline .timeline-detail ').each((index, ele) => {
            let content = $(ele).children('.timeline-content').text().trim()
            content = content.replace(/\n\n/g, '\n')
            let entry = {
                time: moment($(ele).children('.timeline-head').text().trim(), 'HH:mm DD/MM/YYYY').toDate(),
                content: content
            }
            announcement.push(entry)
        })
        resolve(announcement)
    })
}