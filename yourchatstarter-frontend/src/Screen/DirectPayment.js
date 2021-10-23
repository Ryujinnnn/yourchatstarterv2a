import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
import { Footer, Header } from '../Component'

async function getUserInfo(query) {
    return fetch('api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).then(data => data.json())
}

export class DirectPayment extends Component {
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
            <div>
                <Header></Header>
                <div style={{textAlign: 'left', margin: '20px'}}>
                    <h2>Thanh toán trực tiếp</h2>
                    <p>Chuyển khoản trực tiếp tới số tài khoản dưới đây</p>
                    <h3>Nguyễn Ngọc Đăng - 5331 0000 921 488</h3>
                    <h4>Ngân hàng TMCP & PT Việt Nam (BIDV)</h4>
                    <p>Nội dung chuyển khoản: <b>{this.state.username} - {this.state.email} - YourChatStarter</b></p>
                    <p><i>Đơn hàng sẽ được xử lý trong 24h, nếu thất bại, chúng tôi sẽ gửi email thông báo cho bạn</i></p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}
