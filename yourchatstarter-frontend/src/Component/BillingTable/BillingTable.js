import { Component } from "react";
import './Style.css' 

async function getUserBilling() {
    return fetch('api/user/billing', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.getItem("token")
        }
    }).then(data => data.json())
}


export class BillingTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            billing_list: [],
        }
    }

    async componentDidMount() {
        const billing_result = await getUserBilling()
        console.log(billing_result)
        if (billing_result.status === "success") {
            this.setState({
                username: billing_result.username,
                billing_list: billing_result.billing_list,
            })
        }
    }

    render() {
        //table map here
        let formatter = new Intl.NumberFormat('vi', {
            style: 'currency',
            currency: 'VND',
        });

        const table_content = this.state.billing_list.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{val.created_at}</td>
                    <td>{val.plan_name}</td>
                    <td>{formatter.format(val.amount)}</td>
                </tr>
            )
        })

        return (
            <div className="billingContainer">
                <h2>Lịch sử thanh toán</h2>
                <p>Dưới đây là bảng lịch sử thanh toán của bạn</p>
                <table className="billingTable">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ngày thanh toán</th>
                            <th>Tên dịch vụ</th>
                            <th>Giá tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table_content}
                    </tbody>
                </table>
            </div>
        )
    }
}