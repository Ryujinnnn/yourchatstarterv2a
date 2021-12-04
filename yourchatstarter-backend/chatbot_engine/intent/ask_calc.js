const Parser = require('expr-eval').Parser;

// abs x	Absolute value (magnitude) of x
// acos x	Arc cosine of x (in radians)
// acosh x	Hyperbolic arc cosine of x (in radians)
// asin x	Arc sine of x (in radians)
// asinh x	Hyperbolic arc sine of x (in radians)
// atan x	Arc tangent of x (in radians)
// atanh x	Hyperbolic arc tangent of x (in radians)
// cbrt x	Cube root of x
// ceil x	Ceiling of x — the smallest integer that’s >= x
// cos x	Cosine of x (x is in radians)
// cosh x	Hyperbolic cosine of x (x is in radians)
// exp x	e^x (exponential/antilogarithm function with base e)
// expm1 x	e^x - 1
// floor x	Floor of x — the largest integer that’s <= x
// length x	String or array length of x
// ln x	Natural logarithm of x
// log x	Natural logarithm of x (synonym for ln, not base-10)
// log10 x	Base-10 logarithm of x
// log2 x	Base-2 logarithm of x
// log1p x	Natural logarithm of (1 + x)
// not x	Logical NOT operator
// round x	X, rounded to the nearest integer, using "grade-school rounding"
// sign x	Sign of x (-1, 0, or 1 for negative, zero, or positive respectively)
// sin x	Sine of x (x is in radians)
// sinh x	Hyperbolic sine of x (x is in radians)
// sqrt x	Square root of x. Result is NaN (Not a Number) if x is negative.
// tan x	Tangent of x (x is in radians)
// tanh x	Hyperbolic tangent of x (x is in radians)
// trunc x	Integral part of a X, looks like floor(x) unless for negative number

module.exports.run = (entities, option, context, input = "", isLocal = false) => {
    //using entity extraction is too unreliable
    return new Promise((resolve, reject) => {
        //console.log('this is ask_calc intent')
        let response = ""
        let expr_str = ""
        let expr_list = input.match(/([\d\(\+\-]).*([\d\)])/)
        //console.log(expr_list)
        if (entities['wit$math_expression:math_expression']) {
            expr_str = entities['wit$math_expression:math_expression'][0].body
            response = `bằng ${Parser.evaluate(expr_str)} nhé`
        }
        else if (expr_list && expr_list.length > 0) {
            expr_str = expr_list[0]
            try {
                let expr_res = Parser.evaluate(expr_str)
                response = `bằng ${expr_res} nhé`
            }
            catch (e) {
                console.log(e)
                response = "Bạn muốn tính gì?"
            }
        }
        else {
            response = "Bạn muốn tính gì?"
        }
        //console.log(response)
        resolve([response, context])
    })
}

module.exports.name = "ask_calc"

module.exports.isEnable = true