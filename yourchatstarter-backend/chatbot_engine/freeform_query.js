const { wiki_query, wiki_property } = require('../info_module/wikidata_info')
const { get_knowledge } = require('../info_module/google_info/get_knowledge')
const { Language } = require('@nlpjs/language');

module.exports = async function (context, input, intent_res) {
    let vn_desc_not_found = false
    let answer = ""
    //if context failed to get anything out, fallback to a wiki search
    
    let property = ""
    let object_entity = ""
    let wiki_prompt_entity = intent_res.entities.find((val) => val.entity === "wiki_property_entity")

    if (wiki_prompt_entity) {
        property = wiki_prompt_entity.resolution.value.property
        object_entity = wiki_prompt_entity.resolution.value.entity
    }
    if (input.split('của').length >= 2) {
        //attempt for property parsing query
        let comp = input.split('của')
        property = comp[0].trim()
        object_entity = comp[1].trim()
    }

    if (property !== "" && object_entity !== "") {
        await wiki_property(property, object_entity).then(wiki_res => {
            if (wiki_res === "") {
                return
            }
            answer = `${property} của ${object_entity} là ${wiki_res}`
            context.suggestion_list = ['Vinamilk', 'Đồng Hới', "Covid-19"]
        }, (reason) => {
            console.log(reason)
        }).catch((e) => {
            console.log(e)
        })
    }

    if (answer !== "") return answer

    await wiki_query(input).then(wiki_res => {
        if (!wiki_res || wiki_res.length === 0) {
            vn_desc_not_found = true
            return
        }
        let lang = new Language().guessBest(wiki_res[0].description).alpha3 !== "vie"
        if (lang) {
            //wikidata have a tendency to return non-vietnamese result despite forcing it to, check the desc to see if its in vietnamese or not
            vn_desc_not_found = true
        }
        answer = wiki_res[0].label + " là " + wiki_res[0].description
        context.suggestion_list = ['Vinamilk', 'Đồng Hới', "Covid-19"]
    }, (reason) => {
        console.log(reason)
        vn_desc_not_found = true
    }).catch((e) => {
        console.log(e)
        vn_desc_not_found = true
    })

    //wikidata result is more reliable but in case it goes wack, fallback to google knowledge graph search (GKG)
    if (vn_desc_not_found) {
        console.log("wiki res not found, finding in GKG")
        await get_knowledge(input).then(async google_res => {
            //TODO: GKG result is pretty fucking bad, might need to do a strict or fuzzy match for GKG result
            //console.dir(google_res, {depth: null})

            //google_res.itemListElement[0].result.name
            if (!google_res.itemListElement || google_res.itemListElement.length === 0) {
                throw new Error("no google result")
            }
            else {
                first_res = google_res.itemListElement[0]
                if (first_res.resultScore && (first_res.resultScore > 50 || (first_res.resultScore > 10 && !process.env.USE_BARTPHO))) {
                    if (first_res.result.detailedDescription) {
                        answer = first_res.result.detailedDescription.articleBody
                    }
                    else {
                        answer = `${first_res.result.name} là ${first_res.result.description}`
                    }
                    context.suggestion_list = ['Việt Nam', 'Taylor Swift', "Petrolimex"]
                }
                else {
                    throw new Error("no google result")
                }
            }
        })
        .catch((e) => {
            console.log(e)
            answer = ""
        })
    }
    //console.log([answer, context])
    return answer
}