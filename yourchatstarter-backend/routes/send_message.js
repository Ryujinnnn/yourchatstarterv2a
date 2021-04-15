const express = require('express')
const wit_send = require('../wit_client')
const router = express.Router()
const get_weather = require('../info_module/get_weather')
const get_exchange = require('../info_module/get_exchange')

router.post('/', async (req, res) => {
    console.log(req.body);
    let message = req.body.post
    let response = ""
    let parsed_data = await wit_send(message)
    if (parsed_data.intents.length == 0) response = "Mình đéo hiểu bạn đang nói gì :l"
    else if (parsed_data.intents[0].confidence < 0.8) response = "Mình không chắc bạn đang nói gì"
    else if (parsed_data.intents[0].name == "greeting") response = "Chào bạn"
    else if (parsed_data.intents[0].name == "ask_weather") {
      //response = "Đang đợi code chức năng dò thời tiết bạn ơi :v"
      if (!parsed_data.entities['wit$location:location']) {
        response = "Bạn có thể nói rõ thời tiết ở đâu được không?"
      }
      else {
        let location = parsed_data.entities['wit$location:location'][0].body
        await get_weather(location)
          .then(
            (weather_res) => {response = `Hiện tại ở ${location} trời đang ${weather_res.desc}, nhiệt độ khoảng ${weather_res.temp.toFixed(2)} độ C`},
            (e) => response = `Mình không biết thời tiết đang như thế nào ở đó rồi :(`)
      }
    }
    else if (parsed_data.intents[0].name == "ask_exchange_rate") {
      response = "Chức năng đổi ngoại tệ chưa build xong :v"
      if ((!parsed_data.entities['currency:currency']) || (!parsed_data.entities['wit$amount_of_money:amount_of_money'])) {
        response = 'Mình không rõ bạn muốn đổi từ tiền gì ra tiền gì :('
      }
      else {
        let from_currency = parsed_data.entities['wit$amount_of_money:amount_of_money'][0].unit
        let amount = parsed_data.entities['wit$amount_of_money:amount_of_money'][0].value
        let to_currency = parsed_data.entities['currency:currency'][0].value

        await get_exchange(amount, from_currency, to_currency)
          .then(
            (forex_res) => {response = `${amount} ${from_currency} đổi ra được ${forex_res.result} ${to_currency} nhé`},
            (e) => response = `Mình không đổi loại tiền này được bạn ạ :(`
          )
      }
    }
    else if (parsed_data.intents[0].name == "req_translate") {
      response = "Chức năng dịch thuật chưa build xong :v"
    }
    else if (parsed_data.intents[0].name == "ask_calc") {
      if (!parsed_data.entities['wit$math_expression:math_expression']) {
        response = "Bạn muốn tính gì?"
      }
      else {
        let expr_str = parsed_data.entities['wit$math_expression:math_expression'][0].body
        response = `bằng ${eval(expr_str)} nhé`
      }
    }
    else response = "Clgt?"
    res.send(
      response
    );
});

module.exports = router