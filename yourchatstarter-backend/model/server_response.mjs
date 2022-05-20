export class Response {
    constructor() {
        this.status = ""
        this.desc = ""
        this.extraPayload = {}
    }

    toObject() {
        let obj = {
            status: this.status,
            desc: this.desc,
        }
        if (this.extraPayload === {}) obj.payload = this.extraPayload
    }
}