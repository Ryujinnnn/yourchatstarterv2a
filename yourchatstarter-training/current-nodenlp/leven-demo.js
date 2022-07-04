const { editDistance } = require('levenshtein-search')

let s = "i am shrinky"
let t = "shrink"
let ins_count = 0
let del_count = 0
let m = Array(t.length + 1)
for (let i = 0; i < m.length; i++) 
	{m[i] = Array(s.length + 1); m[i].fill(0, 0)}

for (let i = 0; i < m.length; i++) m[i][0] = i
for (let i = 0; i < m[0].length; i++) m[0][i] = 0

for (let i = 1; i < m.length; i++)
	for (let j = 1; j < m[0].length; j++) {
		//console.log(s.charAt(j-1), t.charAt(i-1))
		let sub_cost = (s.charAt(j - 1) === t.charAt(i - 1)) ? 0 : 1;

		m[i][j] = Math.min(m[i-1][j] + 1, //ins, 
							m[i][j-1] + 1, //del
							m[i-1][j-1] + sub_cost) //sub
	}

console.table(m)
console.log(m[m.length - 1][m[0].length - 1])
console.log(Math.min(...m[m.length - 1]))
console.log(ins_count)
console.log(del_count)

// console.log(editDistance(s, t))