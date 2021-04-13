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

app.use("/api/message", message)
app.use("/api/send_message", send_message)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../yourchatstarter-frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})