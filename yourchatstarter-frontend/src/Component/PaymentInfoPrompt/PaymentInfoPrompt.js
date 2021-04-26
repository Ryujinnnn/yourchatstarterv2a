import { Component } from "react";
import './Style.css'
import { withRouter } from 'react-router-dom' 

function getCheckoutLink(info) {
    return fetch('api/payment/submit_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(data => data.json())
}

class PaymentInfoPrompt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            phone_number: "",
            address: "",
            plan_name: "",
            amount: 0,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submit_result = await getCheckoutLink({
            name: this.state.name,
            email: this.state.email,
            phone_number: this.state.phone_number,
            address: this.state.address,
            plan_name: this.props.plan,
            amount: this.state.amount,
            user_token: sessionStorage.getItem('token')
        });
        if (submit_result.status === "success") {
            window.location.href = submit_result.checkout_link; 
        }
    }

    componentDidMount() {
        if (this.props.plan === "premium") {
            this.setState({
                plan_name: "Gói cao cấp (1 tháng)",
                amount: 20000,
            })
        }

        else if (this.props.plan === "lifetime") {
            this.setState({
                plan_name: "Gói cao cấp (trọn đời)",
                amount: 200000,
            })
        }
    }

    render() {
        console.log(this.props.plan)
        const style = {
            backgroundColor: "#4CAF50",
            border: "solid lightgreen 1px",
            color: "white",
            padding: "12px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "15px",
            //borderRadius: "12px",
            width: "10vw",
            display: "inline-block",
            float: "left"
        };

        let formatter = new Intl.NumberFormat('vi', {
            style: 'currency',
            currency: 'VND',
        });

        return (
            <div>
                <div className="payment_row">
                    <div className="payment_column">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="name" maxLength="50" onChange={e => this.setState({name: e.target.value})} placeholder="Họ tên"/>
                            <input type="text" name="email" maxLength="50" onChange={e => this.setState({email: e.target.value})} placeholder="Email"/>
                            <input type="text" name="phone_number" maxLength="20" onChange={e => this.setState({phone_number: e.target.value})} placeholder="Số điện thoại"/>
                            <input type="text" name="address" maxLength="130" onChange={e => this.setState({address: e.target.value})} placeholder="Địa chỉ"/>
                            <button type="submit" value="Checkout" style={style}>Thanh toán</button>
                        </form>
                    </div>
                    <div className="payment_column">
                        <div className="container">
                            <h2>Thanh toán
                                <span className="price" style={{color: 'black'}}>
                                <i className="fa fa-shopping-cart"></i>
                                <b>1</b>
                                </span>
                            </h2>
                            <p><a href="/subscribe">{this.state.plan_name}</a> <span className="price">{formatter.format(this.state.amount)}</span></p>
                            <hr/>
                            <p>Tổng <span className="price" style={{color: 'black'}}><b>{formatter.format(this.state.amount)}</b></span></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(PaymentInfoPrompt)