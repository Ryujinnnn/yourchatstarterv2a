import { Component } from "react";
import './Style.css'
import { Link } from 'react-router-dom'

export class SubscribeTable extends Component {
    render() {

        const premium_location = {
            pathname: '/payment',
            state: { plan: "premium" }
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
                    <li>Chức năng giới hạn</li>
                    <li>Hỗ trợ thông thường</li>
                    <li>Miễn phí đến lúc nào cũng được</li>
                    <li>-</li>
                    <li className="grey">Miễn phí vĩnh viễn :D</li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Cao cấp</li>
                    <li className="grey">20.000đ / tháng</li>
                    <li>Đầy đủ chức năng</li>
                    <li>Hỗ trợ nâng cao</li>
                    <li>Trả phí hằng tháng</li>
                    <li>Được liệt kê trong lời cảm ơn(*)</li>
                    <li className="grey"><Link to={premium_location} className="button">Mua ngay</Link></li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Trọn đời</li>
                    <li className="grey">200.000đ</li>
                    <li>Đầy đủ chức năng</li>
                    <li>Hỗ trợ nâng cao</li>
                    <li>Trả phí một lần duy nhất</li>
                    <li>Được liệt kê trong lời cảm ơn</li>
                    <li className="grey"><Link to={lifetime_location} className="button">Mua ngay</Link></li>
                </ul>
                </div>   
            </div>
        )
    }
}