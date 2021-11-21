const { Wit } = require('node-wit');
const FileType = require('file-type')
const SPEECH_ENDPOINT = 'https://api.wit.ai/speech'
const { Readable } = require('stream');

function bufferToStream(binary) {

    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });

    return readableInstanceStream;
}

function wit_parse(message) {

	return new Promise((resolve, reject) => {
		const wit_client = new Wit({
			accessToken: process.env.WITAI_TOKEN
		});

		wit_client
			.message(message)
			.then(data => {
				//console.dir(data, { depth: null });
				resolve(data)
			})
			.catch(error => {
				console.log(error)
				reject()
			});
	})
}

function wit_voice(data) {
	require('dotenv').config()
	return new Promise(async (resolve, reject) => {
		let bin_data = bufferToStream(data)
		let option = {
			method: 'POST', 
			headers: {
				'Content-Type': "audio/wav",
				'Authorization': 'Bearer ' + process.env.WITAI_TOKEN
			}, 
			body: bin_data
		}

		//console.log(option)
		//console.log(option.body)
		let res = fetch(SPEECH_ENDPOINT , option).then( async res => {
			//console.dir(res.body, { depth: null });
			//who the fuck send multiple JSON string in one response?
			let res_text = await res.text()
			console.log(res_text)
			//WARNING: CAN BREAK IF THEY DECIDE TO CHANGE THE API RESPONSE AGAIN. IF IT BREAK AGAIN, YOU KNOW WHERE TO LOOK
			//split the repsonse and parse multiple split individually
			res_text = res_text.replace(/}\s*{/g, "}||||{")
			let comp = res_text.split("||||")
			//console.log(comp)
			let utter = null
			if (comp.length > 1) {
				//if more than 1 json object string is found, assume first object is for partially detected text 
				//(and ignore it for now because detected text is also included in the utterance response)
				let text = JSON.parse(comp[0])
				utter = JSON.parse(comp[comp.length - 1])
			}
			else {
				utter = JSON.parse(comp[0])
			}
			resolve(utter)
		})
		.catch(error => {
			console.log(error)
			reject()
		});
	})
}

module.exports.parse = wit_parse
module.exports.voice = wit_voice