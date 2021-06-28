var Feed = require('rss-to-json');

//get news from vnexpress rss feed
module.exports.get_news = () => {
    //simply get the latest news from vnexpress
    return new Promise( async (resolve, reject) => {
        let rss = await Feed.load('https://vnexpress.net/rss/thoi-su.rss');
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