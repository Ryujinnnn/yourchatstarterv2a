const express = require('express')
const formidable = require('formidable');
const router = express.Router()
const db = require('../database/database_interaction')
const chatbot = require('../chatbot_engine');
const audioBufferToWav = require('../utils/audio_helper');
const { initial_context } = require('../chatbot_engine/data_model');
const { verifyToken } = require('./middleware/verify_token');

const events = [
    {
      event: 'data',
      action: function (req, res, next, data) { 
          console.log('receiving data...')
          //console.log(req)
      }
    }, 
]

router.post('/', verifyToken, async (req, res) => {
    const form = formidable({ multiples: true });
    //res.json({ fields, files });
    let data = null;
    let buffers = []
    let context = {} //JSON.parse(fields.context);
    let is_local = false

    form.parse(req);

    form.on('field', (fieldName, fieldValue) => {
        if (fieldName === "context") context = JSON.parse(fieldValue) //form.emit('data', { name: 'field', key: fieldName, value: fieldValue });
        else if (fieldName === "is_local") is_local = fieldValue
    });

    form.onPart = (part) => {
        if (part.filename === '' || !part.mime) {
            // used internally, please do not override!
            form.handlePart(part);
            return
        }
        part.on('data', (buffer) => {
            //console.log(buffer)
            buffers.push(buffer)
        });
      };


    form.once('end', async () => {
        let data = Buffer.concat(buffers)
        //console.log(data.byteLength)

        //console.log(context)
        //console.log(data)
    
        if (!context || !context.past_client_message) {
            context = initial_context
        }
    
        let option = {
            isPaid: req.is_paid,
            plan: req.plan
        }
    
        let response = "", updated_context;
        [response, updated_context] = await chatbot.get_response_from_voice(data, option, context)
        res.send({
            response: response,
            context: updated_context
        });
    });
});

module.exports = router