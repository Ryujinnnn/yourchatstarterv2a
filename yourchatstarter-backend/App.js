const express = require('express')
const cors = require("cors")
const path = require('path');

const message = require('./routes/message')
const send_message = require('./routes/send_message')
require('dotenv').config()

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

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/robots.txt'))
})

app.use("/api/message", message)
app.use("/api/send_message", send_message)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})