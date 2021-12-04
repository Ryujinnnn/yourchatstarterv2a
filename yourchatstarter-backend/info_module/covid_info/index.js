const axios = require('axios').default;
const fs = require('fs')
const cheerio = require('cheerio')

const config = {
    httpsAgent: new (require('https').Agent)({rejectUnauthorized: false})
}

module.exports.init_scraper = () => {
    console.log('scraper initialized')
    // this.get_announcement()
    // this.get_country_stat_first_page()
    // this.get_brief_data()
    this.get_country_stat()
    this.get_vaccination_data()
    //update every 4 mins
    setInterval(() => {
        //this.get_announcement()
        //this.get_country_stat_first_page()
        this.get_country_stat()
        this.get_vaccination_data()
    }, 600000)
    //update every 10 mins
    setInterval(() => {
        // this.get_country_stat()
    }, 3600000)
}

module.exports.get_country_stat = (url = 'https://static.pipezero.com/covid/data.json') => {
    console.log('fetching: ' + url)
    axios.get(url, config)
        .then((res) => {
            if (res.status != 200) {
                console.log('woah there stop')
            }
            //console.log(res.data)
            let obj = res.data
            //console.dir(obj, {depth: null})
            let overview = obj.total
            let today_stat = obj.today
            let timeseries_data = obj.overview
            let location_data = obj.locations

            let stat = new Map()
            location_data.forEach((val) => {
                //EVERYTHING TO LOWERCASE TO NORMALIZE THE LOCATION QUERY
                let province_name = val.name.toLowerCase()
                stat.set(province_name, {case: val.cases, recovered: val.recovered, death: val.death, daily_case: val.casesToday})
            })

            stat.set('cả nước', {
                case: overview.internal.cases, 
                recovered: overview.internal.recovered, 
                death: overview.internal.death, 
                daily_case: today_stat.internal.cases,
                daily_recovered: today_stat.internal.recovered,
                daily_death: today_stat.internal.death
            })

            const res_obj = Object.fromEntries(stat)
            fs.writeFileSync('stats.json', JSON.stringify(res_obj, {}, 4))
            console.log('wrote to file file stat.json')
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
}

module.exports.get_vaccination_data = () => {
    axios.get('https://tiemchungcovid19.gov.vn/api/public/dashboard/vaccination-statistics/get-detail-latest', config)
        .then((res) => {
            if (res.status != 200) {
                console.log('woah there stop')
            }
            let obj = res.data
            fs.writeFileSync('vaccination.json', JSON.stringify(obj, {}, 4))
            console.log('wrote to file file vaccination.json')
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
}

module.exports.get_brief_data = () => {
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


