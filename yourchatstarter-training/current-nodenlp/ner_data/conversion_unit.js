const fs = require('fs')

const dec_sq_macro = [
	{prefix: 'square peta', symbol: 'P', value: 1e15, kind: 'big'},
	{prefix: 'square tera', symbol: 'T', value: 1e12, kind: 'big'},
	{prefix: 'square giga', symbol: 'G', value: 1e9, kind: 'big'},
	{prefix: 'square mega', symbol: 'M', value: 1e6, kind: 'big'},
	{prefix: 'square kilo', symbol: 'k', value: 1e3, kind: 'big'},
	{prefix: 'square hecto', symbol: 'h', value: 1e2, kind: 'big'},
	{prefix: 'square deca', symbol: 'da', value: 1e1, kind: 'big'},
	{prefix: 'square deci', symbol: 'd', value: 1e-1, kind: 'small'},
    {prefix: 'square ', symbol: '', value: 1e-2, kind: 'small'},
	{prefix: 'square centi', symbol: 'c', value: 1e-2, kind: 'small'},
	{prefix: 'square milli', symbol: 'm', value: 1e-3, kind: 'small'},
	{prefix: 'square micro', symbol: 'μ', value: 1e-6, kind: 'small'},
	{prefix: 'square nano', symbol: 'n', value: 1e-9, kind: 'small'},
	{prefix: 'square pico', symbol: 'p', value: 1e-12, kind: 'small'},
	{prefix: 'square femto', symbol: 'f', value: 1e-15, kind: 'small'},
];

const dec_macro = [
	{prefix: 'peta', symbol: 'P', value: 1e15, kind: 'big'},
	{prefix: 'tera', symbol: 'T', value: 1e12, kind: 'big'},
	{prefix: 'giga', symbol: 'G', value: 1e9, kind: 'big'},
	{prefix: 'mega', symbol: 'M', value: 1e6, kind: 'big'},
	{prefix: 'kilo', symbol: 'k', value: 1e3, kind: 'big'},
	{prefix: 'hecto', symbol: 'h', value: 1e2, kind: 'big'},
	{prefix: 'deca', symbol: 'da', value: 1e1, kind: 'big'},
	{prefix: 'deci', symbol: 'd', value: 1e-1, kind: 'small'},
	{prefix: 'centi', symbol: 'c', value: 1e-2, kind: 'small'},
	{prefix: 'milli', symbol: 'm', value: 1e-3, kind: 'small'},
	{prefix: 'micro', symbol: 'μ', value: 1e-6, kind: 'small'},
	{prefix: 'nano', symbol: 'n', value: 1e-9, kind: 'small'},
	{prefix: 'pico', symbol: 'p', value: 1e-12, kind: 'small'},
	{prefix: 'femto', symbol: 'f', value: 1e-15, kind: 'small'},
];

const dec_cb_macro = [
	{prefix: 'cubic peta', symbol: 'P', value: 1e15, kind: 'big'},
	{prefix: 'cubic tera', symbol: 'T', value: 1e12, kind: 'big'},
	{prefix: 'cubic giga', symbol: 'G', value: 1e9, kind: 'big'},
	{prefix: 'cubic mega', symbol: 'M', value: 1e6, kind: 'big'},
	{prefix: 'cubic kilo', symbol: 'k', value: 1e3, kind: 'big'},
	{prefix: 'cubic hecto', symbol: 'h', value: 1e2, kind: 'big'},
	{prefix: 'cubic deca', symbol: 'da', value: 1e1, kind: 'big'},
	{prefix: 'cubic deci', symbol: 'd', value: 1e-1, kind: 'small'},
	{prefix: 'cubic centi', symbol: 'c', value: 1e-2, kind: 'small'},
    {prefix: 'cubic ', symbol: '', value: 1e-2, kind: 'small'},
	{prefix: 'cubic milli', symbol: 'm', value: 1e-3, kind: 'small'},
	{prefix: 'cubic micro', symbol: 'μ', value: 1e-6, kind: 'small'},
	{prefix: 'cubic nano', symbol: 'n', value: 1e-9, kind: 'small'},
	{prefix: 'cubic pico', symbol: 'p', value: 1e-12, kind: 'small'},
	{prefix: 'cubic femto', symbol: 'f', value: 1e-15, kind: 'small'},
];

const bin_macro = [
	{prefix: 'pebi', symbol: 'Pi', value: 1024 ** 5, kind: 'big'},
	{prefix: 'tebi', symbol: 'Ti', value: 1024 ** 4, kind: 'big'},
	{prefix: 'gibi', symbol: 'Gi', value: 1024 ** 3, kind: 'big'},
	{prefix: 'mebi', symbol: 'Mi', value: 1024 ** 2, kind: 'big'},
	{prefix: 'kibi', symbol: 'Ki', value: 1024 ** 1, kind: 'big'},
];

const angle = [
    {names: ['radian', 'radians'], symbols: ['rad', 'rads', 'r']},
    {names: ['turn', 'turns']},
    {names: ['degree', 'degrees'], symbols: ['deg', 'degs', '°']},
    {names: ['gradian', 'gradians'], symbols: ['gon', 'gons', 'grad', 'grads', 'grade', 'grades']},
]

const area =  [
    {names: ['meter', 'meters', 'metre', 'metres'], symbols: ['m²', 'm2'], usePrefix: [dec_sq_macro]},
    {names: ['acre', 'acres'], symbols: ['ac']},
    {names: ['centiare', 'centiares'], symbols: ['ca']},
    {names: ['deciare', 'deciares'], symbols: ['da']},
    {names: ['are', 'ares']},
    {names: ['decare', 'decares'], symbols: ['daa']},
    {names: ['hectare', 'hectares'], symbols: ['ha']},
    {names: ['square foot', 'square feet'], symbols: ['sq ft']},
    {names: ['square inch', 'square inches'], symbols: ['sq in']},
    {names: ['square yard', 'square yards'], symbols: ['sq yd']},
    {names: ['square mile', 'square miles'], symbols: ['sq mi']},
]

const data =  [
    {names: ['bit', 'bits'], symbols: ['b'], usePrefix: [dec_macro, bin_macro], allowPrefix: 'big'},
    {names: ['nibble', 'nibbles', 'semioctet', 'semioctets', 'halfbyte', 'halfbytes']},
    {names: ['byte', 'bytes', 'octect', 'octects'], symbols: ['B'], usePrefix: [dec_macro, bin_macro], allowPrefix: 'big'},
    {names: ['hextet', 'hextets']}
]

const energy = [
    {names: ['joule', 'joules'], symbols: ['J'], usePrefix: [dec_macro]},
    {names: ['kilowatt-hour'], symbols: ['kW⋅h', 'kW h', 'kWh']},
]

const force = [
    {names: ['newton', 'newtons'], symbols: ['N']},
    {names: ['dyne', 'dynes'], symbols: ['dyn']},
    {names: ['kilogram-force'], symbols: ['kgf', 'kilopond', 'kiloponds', 'kp']},
    {names: ['pound of force', 'pound-force'], symbols: ['lbf']},
    {names: ['poundal', 'poundals'], symbols: ['pdl']},
]

const distance = [
    {names: ['meter', 'meters', 'metre', 'metres'], symbols: ['m'], usePrefix: [dec_macro]},
    {names: ['foot', 'feet'], symbols: ['ft', "'"]},
    {names: ['inch', 'inches'], symbols: ['in', '"']},
    {names: ['yard', 'yards'], symbols: ['yd']},
    {names: ['mile', 'miles'], symbols: ['mi']},
    {names: ['nautical mile', 'nautical miles'], symbols: ['M', 'NM', 'nmi']},
]

const mass = [
    {names: ['gram', 'grams'], symbols: ['g'], usePrefix: [dec_macro]},
    {names: ['tonne', 'tonnes', 'metric ton', 'metric tons'], symbols: ['t'], usePrefix: [dec_macro]},
    {names: ['pound', 'pounds'], symbols: ['lb']},
    {names: ['stone', 'stones'], symbols: ['st']},
    {names: ['ounce', 'ounces'], symbols: ['oz']},
    {names: ['short ton', 'short tons', 'US ton', 'US tons']},
    {names: ['long ton', 'long tons', 'imperial ton', 'imperial tons', 'displacement ton', 'displacement tons']},
]

const power =  [
    {names: ['watt', 'watts'], symbols: ['W'], usePrefix: [dec_macro]},
    {names: ['horsepower', 'mechanical horsepower'], symbols: ['hp']},
]

const pressure = [
    {names: ['pascal', 'pascals'], symbols: ['Pa'], usePrefix: [dec_macro]},
    {names: ['bar', 'bars'], symbols: ['bar'], usePrefix: [dec_macro]},
    {names: ['torr', 'torrs'], symbols: ['Torr']},
    {names: ['millitorr'], symbols: ['mTorr']},
    {names: ['atmosphere', 'atmospheres'], symbols: ['atm']},
    {names: ['pound per square inch', 'pounds per square inch'], symbols: ['psi', 'lbf/in2', 'lbf/in²']},
]

const temparature = [
    {names: ['kelvin', 'kelvins'], symbols: ['K'], usePrefix: [dec_macro]},
    {names: ['fahrenheit'], symbols: ['F', '°F']},
    {names: ['celsius'], symbols: ['C', '°C']},
]

const time = [
    {names: ['second', 'seconds'], symbols: ['s'], usePrefix: [dec_macro]},
    {names: ['minute', 'minutes'], symbols: ['min']},
    {names: ['hour', 'hours'], symbols: ['h']},
    {names: ['milliday', 'millidays'], symbols: ['md']},
    {names: ['day', 'days'], symbols: ['d']},
    {names: ['week', 'weeks'], symbols: ['wk']},
    {names: ['fortnight', 'fortnights'], symbols: ['fn']},
    {names: ['month', 'months'], symbols: ['mo']},
    {names: ['year', 'years'], symbols: ['y', 'yr']},
    {names: ['decade', 'decades'], symbols: ['dec']},
    {names: ['century', 'centuries']},
    {names: ['millennium', 'millennia']},
    {names: ['moment', 'moments']},
    {names: ['shake', 'shakes']},
    {names: ['time unit'], symbols: ['TU']},
    {names: ['svedberg', 'svedbergs'], symbols: ['S']},
]

const volume = [
    {names: ['meter', 'meters', 'metre', 'metres', 'stere', 'steres'], symbols: ['m³', 'm3'], usePrefix: [dec_cb_macro]},
    {names: ['liter', 'liters', 'litre', 'litres'],symbols: ['l', 'L'], usePrefix: [dec_macro]},
    {names: ['cubic mile', 'cubic miles'], symbols: ['cu mi', 'mi3', 'mi³']},
    {names: ['acre-foot', 'acre-feet'], symbols: ['ac⋅ft', 'ac ft']},
    {names: ['cubic yard', 'cubic yards'], symbols: ['cu yd', 'yd3', 'yd³']},
    {names: ['cubic foot', 'cubic feet'], symbols: ['cu ft', 'ft3', 'ft³']},
    {names: ['board foot', 'board feet']},
    {names: ['cubic inch', 'cubic inches'], symbols: ['cu in', 'in3', 'in³']},
    {names: ['measurement ton', 'measurement tons'], symbols: ['MTON']},
    {names: ['imperial barrel', 'imperial barrels'], symbols: ['imp bbl']},
    {names: ['imperial bushel', 'imperial bushels'], symbols: ['imp bsh', 'imp bu']},
    {names: ['imperial peck', 'imperial pecks'], symbols: ['pk', 'imp pk']},
    {names: ['imperial gallon', 'imperial gallons'], symbols: ['imp gal']},
    {names: ['imperial quart', 'imperial quarts'], symbols: ['imp qt']},
    {names: ['imperial pint', 'imperial pints'], symbols: ['imp pt']},
    {names: ['imperial fluid ounce', 'imperial fluid ounces'], symbols: ['imp fl oz']},
    {names: ['teaspoon', 'teaspoons', 'US teaspoon', 'US teaspoons'], symbols: ['tsp']},
    {names: ['tablespoon', 'tablespoons', 'US tablespoon', 'US tablespoons'], symbols: ['tbsp']},
    {names: ['US fluid ounce', 'US fluid ounces'], symbols: ['fl oz', 'fl. oz.', 'oz. fl.']},
    {names: ['cup', 'cups', 'US legal cup', 'US legal cups'], symbols: ['c']},
    {names: ['pint', 'pints', 'US liquid pint', 'US liquid pints'], symbols: ['pt', 'p']},
    {names: ['quart', 'quarts', 'US liquid quart', 'US liquid quarts'], symbols: ['qt']},
    {names: ['gallon', 'gallons', 'US liquid gallon', 'US liquid gallons'], symbols: ['gal']},
    {names: ['US bushel', 'US bushels'], symbols: ['US bsh', 'US bu']},
    {names: ['US peck'], symbols: ['US pk']},
    {names: ['US dry gallon'], symbols: ['US dry gal']},
    {names: ['US dry barrel', 'US dry barrels'], symbols: ['US dry bbl']},
    {names: ['US dry quart'], symbols: ['US dry qt']},
    {names: ['US dry pint'], symbols: ['US dry pt']},
]

let res = []

function generate_type_table(arr) {
    arr.forEach((val) => {
        let obj = {}
        if (val.symbols) {
            obj = {
                name: val.names[0],
                alias: [...val.names, ...val.symbols]
            }
        }
        else {
            obj = {
                name: val.names[0],
                alias: [...val.names]
            }
        }
        res.push(obj)
        if (val.usePrefix) {
            for (let i = 0; i < val.usePrefix.length; i++) {
                val.usePrefix[i].forEach((prefix_val) => {
                    let prefix_obj = {}
                    if (val.symbols) {
                        prefix_obj = {
                            name: prefix_val.prefix + val.names[0],
                            alias: [...(val.names.map(x => prefix_val.prefix + x)), ...(val.symbols.map(x => prefix_val.symbol + x))]
                        }
                    }
                    else {
                        prefix_obj = {
                            name: prefix_val.prefix + val.names[0],
                            alias: [...(val.names.map(x => prefix_val.prefix + x))]
                        }
                    }
                    res.push(prefix_obj)
                    if (val.allowPrefix && val.allowPrefix !== prefix_val.kind) res.pop()
                })
            }
        }
    })
}

function generate_lookup_table() {
    generate_type_table(angle)
    generate_type_table(area)
    generate_type_table(data)
    generate_type_table(energy)
    generate_type_table(force)
    generate_type_table(mass)
    generate_type_table(power)
    generate_type_table(pressure)
    generate_type_table(temparature)
    generate_type_table(time)
    generate_type_table(volume)
    generate_type_table(distance)
    fs.writeFileSync('conversion_units.json', JSON.stringify(res, {}, '  '), {encoding: 'utf-8'})
}

generate_lookup_table()