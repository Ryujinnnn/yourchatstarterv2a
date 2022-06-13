const DAY_OF_WEEK = ["chủ nhật", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu", "thứ bảy"]

const get_data = {
    "embeded.ask_time": () => {
        return [new Date().toLocaleTimeString('vi-VN', {timeZone: "Asia/Ho_Chi_Minh"})]
    },
    "embeded.ask_date": () => {
        return [new Date().toLocaleDateString('vi-VN', {timeZone: "Asia/Ho_Chi_Minh"})]
    },
    "embeded.ask_day_of_week": () => {
        return [DAY_OF_WEEK[new Date().getDay()]]
    }
}

module.exports.embeded_answer = function (intent, answer_template) {
    let data = []
    data = get_data[intent].call(this)
    let answer = answer_template
    console.log(data)
    if (!data) {
        return answer
    }
    else {
        while (data.length > 0 && answer.includes('|data|')) {
            answer = answer.replace('|data|', data.shift())
        }
        return answer
    }
} 