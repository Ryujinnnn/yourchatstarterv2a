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
			//console.dir(res, { depth: null });
			resolve(await res.json())
		})
		.catch(error => {
			console.log(error)
			reject()
		});
	})
}

module.exports.parse = wit_parse
module.exports.voice = wit_voice