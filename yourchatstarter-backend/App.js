const express = require('express')
const cors = require("cors")
const path = require('path');

const message = require('./routes/message')
const send_message = require('./routes/send_message')
const send_voice = require('./routes/send_voice')
const payment = require('./routes/payment')
const auth = require('./routes/auth')
const user = require('./routes/user')
const blog = require('./routes/blog')
const notification = require('./routes/notification')

const chatbot = require('./chatbot_engine')
const databaseConn = require('./database/database_connection')
const fs = require('fs');
const { init_scraper } = require('./info_module/covid_info');

const { notificationCheck, checkNotification } = require('./routine/notification_check');
const { updateStat } = require('./routine/update_stat');
const { shuffleSuggestion } = require('./routine/shuffle_suggestion_pool');
const { updateServicePermission } = require('./routine/update_permission');

require('dotenv').config()

let IntentHandler = new Map();

//include all intent handler
fs.readdir('./chatbot_engine/intent/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		let intentHandler = require(`./chatbot_engine/intent/${file}`);
		if (intentHandler.isEnable !== true) {
			console.log(`(x) ${file} intent is disable`)
			return
		}
		IntentHandler.set(intentHandler.name, intentHandler)
		console.log(`${file} intent loaded`)
	})
	chatbot.init_engine(IntentHandler)
})

//init scraper
init_scraper()

const app = express()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, '/../yourchatstarter-frontend/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(formidableMiddleware());

app.get('/api', (req, res) => {
	res.send('Hello World!')
})
app.get('/googledc62c33f1ad76070.html', (req, res) => {
	res.sendFile(path.join(__dirname + '/googledc62c33f1ad76070.html'))
})

app.get('/nganluong_e84a46e3adc10e50e96f1dcfa506748b.html', (req, res) => {
	res.sendFile(path.join(__dirname + '/nganluong_e84a46e3adc10e50e96f1dcfa506748b.html'))
})

app.get('/nganluong_cc30bcb3ecc76b173d726514d6b5487f.html', (req, res) => {
	res.sendFile(path.join(__dirname + '/nganluong_cc30bcb3ecc76b173d726514d6b5487f.html'))
})

app.get('/nganluong_d7a5aebf5d3b484f2830f95a2c249bc6.html', (req, res) => {
	res.sendFile(path.join(__dirname + '/nganluong_d7a5aebf5d3b484f2830f95a2c249bc6.html'))
})

app.get('/baokimbcec0b1b88e18cbd26a200ed970d55a3.txt', (req, res) => {
	res.sendFile(path.join(__dirname + '/baokimbcec0b1b88e18cbd26a200ed970d55a3.txt'))
})

app.get('/baokim60568749f73e1e7523bb6b6f994f1c2d.txt', (req, res) => {
	res.sendFile(path.join(__dirname + '/baokim60568749f73e1e7523bb6b6f994f1c2d.txt'))
})

app.get('/baokim3e276ded664110597c4a13f528d97f3f.txt', (req, res) => {
	res.sendFile(path.join(__dirname + '/baokim3e276ded664110597c4a13f528d97f3f.txt'))
})


app.get('/robots.txt', (req, res) => {
	res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/robots.txt'))
})

app.use("/api/message", message)
app.use("/api/send_message", send_message)
app.use("/api/payment", payment)
app.use("/api/auth", auth)
app.use("/api/user", user)
app.use("/api/blog", blog)
app.use("/api/send_voice", send_voice)
app.use("/api/notification", notification )

//ADMIN ACCESS
if (process.env.ADMIN_ACCESS === "1") {
	console.log('Loading admin panel')
	const admin_user = require('./routes/admin/user')
	app.use('/api/admin/user', admin_user)
	const admin_blog = require('./routes/admin/blog')
	app.use('/api/admin/blog', admin_blog)
	const admin_bill = require('./routes/admin/bill')
	app.use('/api/admin/bill', admin_bill)
	const admin_service = require('./routes/admin/service')
	app.use('/api/admin/service', admin_service)
	const api_health_service = require('./routes/admin/api_health_check')
	app.use('/api/admin/api_health', api_health_service)
	const app_stat = require('./routes/admin/app_stat')
	app.use('/api/admin/app_stat', app_stat)
}

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/index.html'));
});

app.listen(port, () => {
	console.log(`Example app listening at port ${port}`)
	//open connection test
	databaseConn.initConnection(() => {
		updateServicePermission()
	}) 

	shuffleSuggestion()
	setInterval(shuffleSuggestion, 900000)
	setInterval(checkNotification, 60000)
	setInterval(updateStat, 60000)
	//console.log('check notification routine setup')
})