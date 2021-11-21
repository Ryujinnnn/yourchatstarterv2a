const fs = require('fs');

module.exports = async function trainnlp(manager) {
    if (fs.existsSync('./model-vi.nlp')) {
        console.log("Language model found, loading model instead...")
        manager.load('./model-vi.nlp');
        return;
    }
    console.log("Language model not found, training starting...")
}