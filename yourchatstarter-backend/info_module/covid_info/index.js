const axios = require('axios').default;
const fs = require('fs')
const cheerio = require('cheerio')

const config = {
    httpsAgent: new (require('https').Agent)({rejectUnauthorized: false})
}

module.exports.init_scraper = () => {
    console.log('scraper initialized')
    this.get_announcement()
    this.get_country_stat_first_page()
    this.get_brief_data()
    //update every 4 mins
    setInterval(() => {
        this.get_announcement()
        this.get_country_stat_first_page()
    }, 600000)
    //update every 10 mins
    setInterval(() => {
        this.get_country_stat()
    }, 3600000)
}

module.exports.get_country_stat = (all_case = [], url = 'https://ncov.moh.gov.vn/') => {
    console.log('fetching: ' + url)
    axios.get(url, config)
    .then((res) => {
        if (res.status != 200) {
            console.log('woah there stop')
        }
        let data = res.data
        // fs.writeFileSync('src.html', data)
        // console.log('wrote to file')
        const $ = cheerio.load(data);
        //risky selector
        //parsing patient table (probably will be removed or altered once the number of cases goes too big)
        $('table.table-covid19 tbody tr').each((index, ele) => {
            let entry = {
                id: "",
                age: "",
                province: "",
                status: "",
                nationality: "",
            }
            //console.log(index + ":" + $(ele).text())
            $(ele).children('td').each((index, c_ele) => {
                let col_data = $(c_ele).text().trim()
                switch(index) {
                    case 0: entry.id = col_data; break;
                    case 1: entry.age = col_data; break;
                    case 2: entry.province = col_data; break;
                    case 3: entry.status = col_data; break;
                    case 4: entry.nationality = col_data; break;
                    default: console.log('unknown field')
                }
            })
            //console.log(index)
            //let $table_row = $(this)
            all_case.push(entry)
        })
        //get the button
        const button = $('.lfr-pagination-buttons').children('li').children('a')[1]
        //button[1].attribs.href
        let ref_url = button.attribs.href
        if (ref_url !== "javascript:;") {
            //console.log(all_case)
            setTimeout(() => {
                this.get_country_stat(all_case, ref_url)
            }, 1000)
        }
        else {
            fs.writeFileSync('cases.json', JSON.stringify(all_case, {}, 4))
            console.log('wrote to file file cases.json')
            this.get_brief_data()
        }
        //console.log(button)
    })
    .catch((error) => {
        // handle error
        console.log(error);
    })
}

module.exports.get_brief_data = () => {
    let all_case = JSON.parse(fs.readFileSync('cases.json'))
    //stat by province
    let stat = new Map()

    all_case.forEach((val) => {
        //EVERYTHING TO LOWERCASE TO NORMALIZE THE LOCATION QUERY
        let province_name = val.province.toLowerCase()
        if (!stat.has(province_name)) {
            stat.set(province_name, {case: 0, recovered: 0, death: 0})
        }
        let x = stat.get(province_name)
        if (val.status === "Khỏi") {x.case += 1; x.recovered += 1}
        else if (val.status === "Tử vong") {x.case += 1; x.death += 1}
        else {x.case += 1}
        stat.set(province_name, x)
    })

    let total_stat = {case: 0, recovered: 0, death: 0}
    stat.forEach((val) => {
        total_stat.case += val.case
        total_stat.recovered += val.recovered
        total_stat.death += val.death
    })
    stat.set("cả nước", total_stat)
    const obj = Object.fromEntries(stat)
    fs.writeFileSync('stats.json', JSON.stringify(obj, {}, 4))
    console.log('wrote to file file stat.json')
}

module.exports.get_country_stat_first_page = () => {
    axios.get('https://ncov.moh.gov.vn/', config)
        .then((res) => {
            if (res.status != 200) {
                console.log('woah there stop')
            }
            let data = res.data
            fs.writeFileSync('src.html', data)
            console.log('wrote to file src.html')
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
}

module.exports.get_announcement = () => {
    axios.get('https://ncov.moh.gov.vn/dong-thoi-gian', config)
        .then((res) => {
            if (res.status != 200) {
                console.log('woah there stop')
            }
            let data = res.data
            fs.writeFileSync('timeline.html', data)
            console.log('wrote to file file timeline.html')
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
}


