const corpus_data = require('./corpus_data/corpus-vi-basic.json')
const fs = require('fs')

function get_random_index (length) {
    return Math.max(0, Math.ceil(Math.random() * length) - 1)
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

let text = []

corpus_data.data.forEach((intent_entry) => {
    if (intent_entry.intent === "None") return
    //with each utterance, pair it with a random answers from that intent
    intent_entry.utterances.forEach((utter) => {
        utter = "<s> " + utter + " </s>"
        if (utter.includes(",")) utter = "\"" + utter + "\""
        //answer = intent_entry.answers[get_random_index(intent_entry.answers.length)]
        let answer_pool = intent_entry.answers
        answer_pool.forEach((answer) => {
            answer = "<s> " + answer + " </s>"
            if (answer.includes(",")) answer = "\"" + answer + "\""
            text.push(`${utter},${answer}`)
        })
    })
})

text = shuffle(text)

fs.writeFileSync('bart_data.csv', 'source,target\n' + text.join('\n'), { encoding: 'utf-8' })
console.log('done')