import { Component } from "react";
import './Style.css' 

async function getUserInfo(query) {
    return fetch('api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).then(data => data.json())
}

export class ProfileContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            paid_valid_until: "",
            status: "",
        }
    }

    async componentDidMount() {
        const profile_result = await getUserInfo({
            token: sessionStorage.getItem("token")
        })
        if (profile_result.status === "success") {
            this.setState({
                username: profile_result.user.username,
                email: profile_result.user.email,
                paid_valid_until: profile_result.user.paid_valid_until,
                status: profile_result.user.status,
            })
        }
    }

    render() {
        return (
            <div className="profileContainer">
                <p>Tên người dùng: <span className="profileInfoText">{this.state.username}</span></p>
                <p>Email: <span className="profileInfoText">{this.state.email}</span></p>
                <p>Hạn sử dụng bản cao cấp đến: <span className="profileInfoText">{this.state.paid_valid_until}</span></p>
                <p>Trạng thái tài khoản: <span className="profileInfoText">{this.state.status}</span></p>
            </div>
        )
    }
}