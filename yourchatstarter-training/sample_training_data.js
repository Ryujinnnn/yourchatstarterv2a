const sample_intent = {
    name: "buy_flower",
}

const sample_entity = {
    name: "favourite_city",
    role: [],
    lookups: ["freetext", "keywords"],
    keywords: [],
}

const sample_keyword = {
    keyword: "Paris",
    symnonyms: ["Paris", "City of Light", "Capital of France"]
}

const sample_trait = {
    name: "politeness",
    values: ["polite", "rude"]
}

const sample_train = [
    {
        text: "What's the weather in London",
        intent: "get_weather",
        entities: [
            {
                entity: "wit$location:location",
                start: 22,
                end: 28,
                boday: "London",
                entities: [],
            }
        ],
        traits: []
    }
]