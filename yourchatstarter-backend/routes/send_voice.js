const express = require('express')
const formidable = require('formidable');
const router = express.Router()
const db = require('../database/database_interaction')
const chatbot = require('../chatbot_engine');
const audioBufferToWav = require('../utils/audio_helper');

const events = [
    {
      event: 'data',
      action: function (req, res, next, data) { 
          console.log('receiving data...')
          //console.log(req)
      }
    }, 
]

function checkIsPaid(token) {
    return new Promise(async (resolve, reject) => {
        if (!token) {
            resolve([false, "none"])
            return
        }
        let tokenQuery = {
            token: token
        }

        let query_result = await db.queryRecord("session", tokenQuery)
        if (query_result.length == 0) {
            resolve([false, "none"])
            return
        }
        else {
            if (query_result[0].is_paid) resolve([true, query_result[0].plan])
            else resolve([false, "none"])
            return
        }
    })
}

router.post('/', async (req, res) => {
    const form = formidable({ multiples: true });
    //res.json({ fields, files });
    let data = null;
    let buffers = []
    let context = {} //JSON.parse(fields.context);
    let token = "" //(fields.token || fields.token != "null") ? fields.token : "";

    form.parse(req);

    form.on('field', (fieldName, fieldValue) => {
        if (fieldName === "context") context = JSON.parse(fieldValue) //form.emit('data', { name: 'field', key: fieldName, value: fieldValue });
        else if (fieldName === "token") token = (fieldValue || fieldValue != "null") ? fieldValue : "";
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

    // form.onPart = function (part) {
    //     console.log('on part')
    //     // let formidable handle only non-file parts
    //     if (part.originalFilename === '' || !part.mimetype) {
    //         // used internally, please do not override!
    //         form._handlePart(part);
    //     }
    //     else {
    //         buffers.push(part)
    //     }
    // };

    form.once('end', async () => {
        let data = Buffer.concat(buffers)
        //console.log(data.byteLength)

        //console.log(context)
        //console.log(data)
        let option = {
            isPaid: false,
            plan: "none"
        }
    
        let [isPaid, plan] = await checkIsPaid(token)
        option.isPaid = isPaid
        option.plan = plan
    
        let response, updated_context;
        [response, updated_context] = await chatbot.get_response_from_voice(data, option, context)
        res.send({
            response: response,
            context: updated_context
        });
    });

    
    
});

module.exports = router