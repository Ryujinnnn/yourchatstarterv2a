export class User {
    constructor(username, password, email) {
        //TODO: add more relevant field
        this.username = username
        this.password = password
        this.email = email
    }
}

export class UserAuth {
    constructor(username, password) {
        this.username = username
        this.password = password
    }
}