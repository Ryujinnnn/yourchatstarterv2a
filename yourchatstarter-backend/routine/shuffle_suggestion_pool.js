const corpus = require('../../yourchatstarter-training/current-nodenlp/corpus_data/corpus-vi-basic.json')
const { smalltalk_suggestion } = require('../database/session_storage')

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

module.exports.shuffleSuggestion = () => {
    let cur_pool = []
    if (smalltalk_suggestion.length === 0) {
        //initial load
        corpus.data.forEach((intent) => {
            if (intent.intent == "None" || intent.intent == "greeting.hello") return 
            cur_pool.push(...intent.utterances)
        })
        console.log('smalltalk utterance loaded')
    }
    else {
        cur_pool = [...smalltalk_suggestion]
    }

    //shuffle
    cur_pool = shuffle(cur_pool)

    if (smalltalk_suggestion.length === 0) {
        for (const i of cur_pool) smalltalk_suggestion.push(i)
    }
    else {
        for (const i of cur_pool) {
            smalltalk_suggestion.shift()
            smalltalk_suggestion.push(i)
        }
    }
}