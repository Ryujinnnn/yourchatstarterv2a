const { fuzzySearch } = require('levenshtein-search')

const default_entity = {
    start: 0,
    end: 0,
    len: 1,
    accuracy: 0,
    sourceText: " ",
    utteranceText: " ",
    entity: "",
    resolution: {}
} 

const default_resolution = {
    type: "",
    str: "",
    value: null,
}

class customNERImplementation {

    //inject this resolution 
    constructor(name, locale = "en") {
        this.name = name
        this.locale = locale
        this.regexRule = []
        this.dictRule = []
    }
    
    addNewRegexRule(pattern, output = null) {
        let new_rule = {
            pattern: pattern,
            output: output //null to reflect found string
        }

        this.regexRule.push(new_rule)
    }

    addNewDictRule(options, output = null, threshold = 0.8) {
        let new_rule = {
            options: options,
            output: output, //null to reflect found string
            threshold: threshold
        }
        options = options.map(val => val.toLowerCase())

        this.dictRule.push(new_rule)
    }

    processRegexRule(input, rule) {
        let res = null
        let pattern = new RegExp(rule.pattern)

        let match_str = [...input.matchAll(pattern)]
        match_str.forEach((val) => {
            const match_str = val[0]
            const match_len = match_str.length
            res = {
                start: val["index"],
                end: val["index"] + match_len,
                len: match_len,
                accuracy: 1,
                sourceText: match_str ,
                utteranceText: match_str,
                entity: this.name,
                resolution: {
                    type: this.name,
                    str: match_str,
                    value: (rule.output) ? rule.output : match_str,
                }
            }
        })

        return res
    }

    processDictRule(input, rule) {
        let res = null
        let candidate = [] 
        rule.options.forEach((val) => {
            //console.log(`checking against ${val}, minimum dist will be ${Math.round(val.length - val.length * rule.threshold)}`)
            let new_candidate = [...fuzzySearch(val, input, Math.round(val.length - val.length * rule.threshold))]
            new_candidate = new_candidate.map(entry => {return {...entry, accuracy: (val.length - entry.dist) / val.length}})
            candidate = candidate.concat(new_candidate)
        })

        //console.log(candidate)

        const reducer = function(prev, current) {
            return (prev === null || prev.accuracy < current.accuracy ) ? current : prev
        }

        const best = candidate.reduce(reducer, null)
        //console.log(best)
        
        if (best) {
            const best_str = input.substring(best.start, best.end)
            res = {
                start: best.start,
                end: best.end,
                len: best.end - best.start,
                accuracy: best.accuracy,
                sourceText: best_str ,
                utteranceText: best_str,
                entity: this.name,
                resolution: {
                    type: this.name,
                    str: best_str,
                    value: (rule.output) ? rule.output : best_str,
                }
            }
        }
    }

    process(input) {
        //return an array of resolution
        let res = []

        //preprocess input
        input = input.toLowerCase()

        this.regexRule.forEach((rule) => {
            let entry_res = this.processRegexRule(input, rule)
            if (entry_res) res.push(entry_res)
        })

        this.dictRule.forEach((rule) => {
            let entry_res = this.processDictRule(input, rule)
            if (entry_res) res.push(entry_res)
        })

        console.log(res)
        return res
    }
}

module.exports.customNER = customNERImplementation