import { Component } from "react";
import './Style.css'
import { Link } from 'react-router-dom'

export class SubscribeTable extends Component {
    render() {

        const premium_location = {
            pathname: '/payment',
            state: { plan: "premium" }
        }

        const standard_location = {
            pathname: '/payment',
            state: { plan: "standard" }
        }

        const lifetime_location = {
            pathname: '/payment',
            state: { plan: "lifetime" }
        }
        return(
            <div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Cơ bản</li>
                    <li className="grey">Miễn phí</li>
                    <li>Giải đáp về thời tiết</li>
                    <li>Giải đáp về tính toán</li>
                    <li>Giao tiếp cơ bản</li>
                    <li>-</li>
                    <li className="grey">Miễn phí vĩnh viễn :D</li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Tiêu chuẩn</li>
                    <li className="grey">10.000đ / tháng</li>
                    <li>Toàn bộ chức năng của gói tiêu chuẩn</li>
                    <li>Giải đáp về tỉ giá ngoại tệ</li>
                    <li>Giải đáp về chỉ số chứng khoán</li>
                    <li>Đắng kí theo tháng</li>
                    <li className="grey"><Link to={standard_location} className="button">Mua ngay</Link></li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Cao cấp</li>
                    <li className="grey">20.000đ / tháng</li>
                    <li>Toàn bộ chức năng của gói tiêu chuẩn</li>
                    <li>Giải đáp về dịch thuật</li>
                    <li>-</li>
                    <li>Trả phí hằng tháng</li>
                    <li className="grey"><Link to={premium_location} className="button">Mua ngay</Link></li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Trọn đời</li>
                    <li className="grey">200.000đ</li>
                    <li>Toàn bộ chức năng của gói cao cấp</li>
                    <li>-</li>
                    <li>-</li>
                    <li>Trả phí một lần duy nhất</li>
                    <li className="grey"><Link to={lifetime_location} className="button">Mua ngay</Link></li>
                </ul>
                </div>   
            </div>
        )
    }
}