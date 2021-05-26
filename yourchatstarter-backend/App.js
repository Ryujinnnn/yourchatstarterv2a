const express = require('express')
const cors = require("cors")
const path = require('path');

const message = require('./routes/message')
const send_message = require('./routes/send_message')
const payment = require('./routes/payment')
const auth = require('./routes/auth')
const user = require('./routes/user')
const chatbot = require('./chatbot_engine')
const databaseConn = require('./database/database_connection')
const fs = require('fs')

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

const app = express()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, '/../yourchatstarter-frontend/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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


app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/robots.txt'))
})

app.use("/api/message", message)
app.use("/api/send_message", send_message)
app.use("/api/payment", payment)
app.use("/api/auth", auth)
app.use("/api/user", user)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
  //open connection test
  databaseConn.initConnection()
})