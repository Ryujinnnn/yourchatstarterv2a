//very rudementary parser
//break down at 9007199254740991 due to int limit (too lazy to write in bigint)

const base_number = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']

function parse_reading(inp) {
    //parse vietnamese text into number
    console.log(inp)
    let res = 0

    let billion_comp = inp.trim().split(/tỉ|tỷ/g)
    billion_comp.forEach((b_val, b_index) => {
        let b_res = 0
        let million_comp = b_val.trim().split(/triệu/g)
        million_comp.forEach((m_val, m_index) => {
            let tenthousand_comp = m_val.trim().split(/vạn/g)
            let m_res = 0
            tenthousand_comp.forEach((tt_val, tt_index) => {
                let thousand_comp = tt_val.trim().split(/nghìn|ngàn/g)
                let tt_res = 0
                thousand_comp.forEach((t_val, t_index) => {
                    let hundred_comp = t_val.trim().split(/trăm/g)
                    let t_res = 0
                    //console.log(hundred_comp)
                    hundred_comp.forEach((h_val, h_index) => {
                        let token = h_val.trim().split(' ')
                        let h_res = 0
                        token.forEach((t) => {
                            if ((h_res > 0 || t === "mươi") && h_res * 10 < 100) h_res *= 10
                            let num = base_number.findIndex(val => val === t)
                            if (num !== -1) h_res += num
                            if (t === "lăm" && h_res > 0) h_res += 5
                            if (t === "tư" && h_res > 0) h_res += 4
                            if (t === "mốt" && h_res > 0) h_res += 1 
                        })

                        t_res += h_res
                        if (h_index < hundred_comp.length - 1) t_res *= 100
                    })

                    tt_res += t_res
                    if (t_index < thousand_comp.length - 1) tt_res *= 1000
                })

                m_res += tt_res
                if (tt_index < tenthousand_comp.length - 1) m_res *= 10000
            })

            b_res += m_res
            if (m_index < million_comp.length - 1) b_res *= 1000000
        })

        res += b_res
        if (b_index < billion_comp.length - 1) res *= 1000000000
    })

    console.log(res)
    return res
}

// parse_reading('mười')
// parse_reading('hai mươi tư')
// parse_reading('ba trăm năm bảy')
// parse_reading('hai mươi lăm ngàn một trăm ba bảy')
// parse_reading('một tỷ một trăm ba chín triệu bốn trăm ba mươi ngàn hai trăm bảy mươi')
// parse_reading('chín tỷ bốn trăm mười tám ngàn hai trăm không tám')
// parse_reading('ba tỷ tỷ')

module.exports = parse_reading