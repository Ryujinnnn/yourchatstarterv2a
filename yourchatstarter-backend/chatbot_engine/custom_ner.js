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
    
    addNewRegexRule(pattern, output = null, process_output = null) {
        let new_rule = {
            pattern: pattern,
            output: output, //null to reflect found string
            process_output: process_output
        }

        this.regexRule.push(new_rule)
    }

    addNewDictRule(options, output = null, threshold = 0.8, parse_prefix = null, parse_suffix = null) {
        let new_rule = {
            options: options,
            output: output, //null to reflect found string
            threshold: threshold,
            parse_prefix: parse_prefix,
            parse_suffix: parse_suffix
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
                type: 'regex',
                sourceText: match_str ,
                utteranceText: match_str,
                entity: this.name,
                resolution: {
                    type: this.name,
                    str: match_str,
                    value: (rule.output) ? rule.output : match_str,
                }
            }

            if (rule.process_output) {
                res.resolution.value = rule.process_output(match_str)
            }
        })

        return res
    }

    processDictRule(input, rule) {
        let res = null
        let candidate = [] 
        rule.options.forEach((val) => {
            //console.log(`checking against ${val}, minimum dist will be ${Math.round(val.length - val.length * rule.threshold)}`)
            let new_candidate = [...fuzzySearch(val, input, Math.floor(val.length - val.length * rule.threshold))]
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
                type: 'enum',
                option: best_str,
                sourceText: best_str ,
                utteranceText: best_str,
                entity: this.name,
                resolution: {
                    type: this.name,
                    str: best_str,
                    value: best_str,
                }
            }

            if (rule.parse_prefix || rule.parse_suffix) {
                //if number_prefix or number_suffix is 
                let [prefix, suffix] = input.split(best_str)
                let prefix_val = prefix, suffix_val = suffix
                if (rule.parse_prefix) {
                    try { prefix_val = prefix.match(rule.parse_prefix)[0] }
                    catch (e) {}
                    res.utteranceText = prefix_val + res.utteranceText
                }
                if (rule.parse_suffix) {
                    try { suffix_val = suffix.match(rule.parse_suffix)[0] }
                    catch (e) {}
                    res.utteranceText = res.utteranceText + suffix_val
                }
                res.resolution.value = rule.output(prefix_val, best_str, suffix_val)
            }
            else if (rule.output) {
                res.resolution.value = rule.output
                res.option = rule.output
            }
        }

        return res
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

        //console.log(res)
        return res
    }
}

function cleanEntities(initial_entities) {
    let entities_res = []
    //console.log(initial_entities)
    //eliminate sub entity
    initial_entities.forEach((entity) => {
        let find = initial_entities.find((val) => {
            //console.log((entity.entity === val.entity) && (entity.start >= val.start) && (entity.end <= val.end) && (val.alias && entity.alias !== val.alias))
            return (entity.entity === val.entity) && (entity.start >= val.start) && (entity.end <= val.end) && (val.alias && entity.alias !== val.alias)
        })
        if (!find) {
            entities_res.push(entity)
        }
        // else {
        //     console.log('aaaaaaa')
        // }
    })

    //sort entity to not mess up the order
    entities_res.sort((x, y) => {
        if (x.entity < y.entity) { return -1; }
        if (x.entity > y.entity) { return 1; }
        else return x.start - y.start
    })
    //console.log(entities_res)
    //re-label the alias
    let entities_final = []
    let current_entity = ""
    let current_entity_counter = 0
    entities_res.forEach((entity) => {
        if (entity.entity !== current_entity) {
            current_entity = entity.entity
            current_entity_counter = 0
        }
        else {
            current_entity_counter += 1
        }
        entity.alias = entity.entity + "_" + current_entity_counter
        entities_final.push(entity)
    })
    //console.log(entities_final)
    return entities_final
}

module.exports.customNER = customNERImplementation
module.exports.cleanEntities = cleanEntities