import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Divider, Panel } from "rsuite";
// import Footer from "./Component/Footer/Footer";
import { Footer, Header } from '../Component'
import './Test.css'

async function getUserInfo(query) {
    return fetch('api/user/profile', {
        method: 'GET',
        headers: {
            'x-access-token':  sessionStorage.getItem("token")
        }
    }).then(data => {
        return data.json()
    })
}

export class _DirectPayment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            paid_valid_until: "",
            status: "",
        }

        this.amount = "0"
        this.qr_url = `${process.env.PUBLIC_URL}/qr_non.jpg`
    }

    async componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        this.amount = urlParams.get('amount')

        if (this.amount === "10000") this.qr_url = `${process.env.PUBLIC_URL}/qr_10k.jpg`
        else if (this.amount === "20000") this.qr_url = `${process.env.PUBLIC_URL}/qr_20k.jpg`
        else if (this.amount === "200000") this.qr_url = `${process.env.PUBLIC_URL}/qr_200k.jpg`

        const profile_result = await getUserInfo()
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
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'stretch', padding: 40}} className="direct-payment-container">
                    <Panel header={<h5>Thanh toán chuyển khoản ngân hàng</h5>} className="direct-payment-item" bordered>
                        <div style={{lineHeight: 2, textAlign: 'left'}}>
                            <p>Chuyển khoản trực tiếp tới số tài khoản dưới đây</p>
                            <h4 style={{lineHeight: 5}}>Nguyễn Ngọc Đăng - 5331 0000 921 488</h4>
                            <p>Ngân hàng TMCP & PT Việt Nam (BIDV)</p>
                            <p>Nội dung chuyển khoản: <b>{this.state.username || "<Tên đăng nhập>"} - YourChatStarter</b></p>
                            <p>Số tiền chuyển khoản: <b>{this.amount} VND</b></p>
                        </div>
                    </Panel>
                    <Panel header={<h5>Thanh toán qua ví điện tử MoMo</h5>} className="direct-payment-item" bordered>
                        <p>Vui lòng quét mã QR dưới đây với lời nhắn: <b>{this.state.username || "<Tên đăng nhập>"} - YourChatStarter</b></p>
                        <br />
                        <img src={this.qr_url} alt={`qr_${this.amount}`} width={200}></img>
                    </Panel>
                </div>
                <Divider></Divider>
                <p><i>Đơn hàng sẽ được xử lý trong 24h, nếu thất bại, chúng tôi sẽ gửi email thông báo cho bạn</i></p>
                <Footer></Footer>
            </div>
        )
    }
}

export const DirectPayment = withRouter(_DirectPayment)