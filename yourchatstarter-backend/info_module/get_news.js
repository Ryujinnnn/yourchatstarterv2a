var Feed = require('rss-to-json');

const rss_url = {
    "thời sự": 'https://vnexpress.net/rss/thoi-su.rss',
    "quốc tế": "https://vnexpress.net/rss/the-gioi.rss", 
    "kinh doanh": "https://vnexpress.net/rss/kinh-doanh.rss",
    "startup": "https://vnexpress.net/rss/startup.rss",
    "giải trí": "https://vnexpress.net/rss/giai-tri.rss",
    "thế thao": "https://vnexpress.net/rss/the-thao.rss",
    "pháp luật": "https://vnexpress.net/rss/phap-luat.rss",
    "giáo dục": "https://vnexpress.net/rss/giao-duc.rss",
    "sức khỏe": "https://vnexpress.net/rss/suc-khoe.rss",
    "đời sống": "https://vnexpress.net/rss/gia-dinh.rss",
    "du lịch": "https://vnexpress.net/rss/du-lich.rss",
    "khoa học": "https://vnexpress.net/rss/khoa-hoc.rss",
    "số hóa": "https://vnexpress.net/rss/so-hoa.rss",
    "xe": "https://vnexpress.net/rss/oto-xe-may.rss",
    "chuyện vui": "https://vnexpress.net/rss/cuoi.rss",
}

//get news from vnexpress rss feed
module.exports.get_news = (category = "") => {
    //simply get the latest news from vnexpress
    return new Promise( async (resolve, reject) => {
        let url = 'https://vnexpress.net/rss/thoi-su.rss'
        if (category) {
            url = rss_url[category.toLowerCase()] || 'https://vnexpress.net/rss/thoi-su.rss'
        }
        let rss = await Feed.load(url);
        //console.log(JSON.stringify(rss, null, 3));
        if (rss.items.length < 1) reject("Server error")
        let img_link = rss.items[0].description.match(/<img src=.* >/);
        let news_result = {
            title: rss.items[0].title,
            desc: rss.items[0].description.replace(/<a href=.*<\/br>/, ""),
            img_link: (img_link)? img_link[0] : "",
            article_link: rss.items[0].url,
            created_at: rss.items[0].published
        }
        resolve(news_result)
    })
    
}