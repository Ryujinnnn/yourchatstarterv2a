const { Wit } = require('node-wit');

function wit_parse(message) {
  return new Promise((resolve, reject) =>  {
    const wit_client = new Wit({
        accessToken: process.env.WITAI_TOKEN
    });

    wit_client
        .message(message)
        .then(data => {
          console.dir(data, { depth: null });
          resolve(data)
        })
        .catch(error => {
          console.log(error)
          reject()
        });
  })
}

module.exports = wit_parse