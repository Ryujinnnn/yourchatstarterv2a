const { smalltalk_suggestion } = require('../../database/session_storage')
const random_helper = require('../utils/random_helper')

Array.prototype.slice_wrap = function (start, end) {
    if (start <= end) {
        return this.slice(start, end)
    }
    else {
        return this.slice(start).concat(this.slice(0, end))
    }
}