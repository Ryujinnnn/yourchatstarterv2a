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
            // <div>
            //     <div className="columns">
            //     <ul className="price">
            //         <li className="header">Cơ bản</li>
            //         <li className="grey">Miễn phí</li>
            //         <li>Giải đáp về thời tiết</li>
            //         <li>Giải đáp về tính toán</li>
            //         <li>Giao tiếp cơ bản</li>
            //         <li>-</li>
            //         <li className="grey">Miễn phí vĩnh viễn :D</li>
            //     </ul>
            //     </div>
            //     <div className="columns">
            //     <ul className="price">
            //         <li className="header">Tiêu chuẩn</li>
            //         <li className="grey">10.000đ / tháng</li>
            //         <li>Toàn bộ chức năng của gói tiêu chuẩn</li>
            //         <li>Giải đáp về tỉ giá ngoại tệ</li>
            //         <li>Giải đáp về chỉ số chứng khoán</li>
            //         <li>Trả phí hằng tháng</li>
            //         <li className="grey"><Link to={standard_location} className="button">Mua ngay</Link></li>
            //     </ul>
            //     </div>
            //     <div className="columns">
            //     <ul className="price">
            //         <li className="header">Cao cấp</li>
            //         <li className="grey">20.000đ / tháng</li>
            //         <li>Toàn bộ chức năng của gói tiêu chuẩn</li>
            //         <li>Giải đáp về dịch thuật</li>
            //         <li>-</li>
            //         <li>Trả phí hằng tháng</li>
            //         <li className="grey"><Link to={premium_location} className="button">Mua ngay</Link></li>
            //     </ul>
            //     </div>
            //     <div className="columns">
            //     <ul className="price">
            //         <li className="header">Trọn đời</li>
            //         <li className="grey">200.000đ</li>
            //         <li>Toàn bộ chức năng của gói cao cấp</li>
            //         <li>-</li>
            //         <li>-</li>
            //         <li>Trả phí một lần duy nhất</li>
            //         <li className="grey"><Link to={lifetime_location} className="button">Mua ngay</Link></li>
            //     </ul>
            //     </div>   
            // </div>
            <div id="price">
            {/* <!--price tab--> */}
            <div class="plan">
                <div class="plan-inner">
                    <div class="entry-title">
                        <h3>Gói cơ bản</h3>
                        <div class="price">Miễn phí
                        </div>
                    </div>
                    <div class="entry-content">
                        <ul>
                        <li>Tra cứu thời tiết</li>
                        <li>Làm phép tính</li>
                        <li>Giao tiếp cơ bản</li>
                        <li>Sử dụng không giới hạn</li>
                        </ul>
                    </div>
                    <div class="btn">
                        Miễn phí vĩnh viễn :D
                    </div>
                </div>
            </div>
            {/* <!-- end of price tab-->
            <!--price tab--> */}
            <div class="plan basic">
                <div class="plan-inner">
                <div class="hot">hot</div>
                <div class="entry-title">
                    <h3>Gói tiêu chuẩn</h3>
                    <div class="price">10.000 đ/tháng
                    </div>
                </div>
                <div class="entry-content">
                    <ul>
                    <li>Toàn bộ chức năng của gói cơ bản</li>
                    <li>Tra cứu tỉ giá ngoại tệ</li>
                    <li>Tra cứu giá chứng khoán</li>
                    <li>Trả phí hàng tháng</li>
                    </ul>
                </div>
                <div class="btn">
                    <Link to={standard_location}>Mua ngay</Link>
                </div>
                </div>
            </div>
            {/* <!-- end of price tab-->
            <!--price tab--> */}
            <div class="plan standard">
                <div class="plan-inner">
                <div class="entry-title">
                    <h3>Gói cao cấp</h3>
                    <div class="price">20.000 đ/tháng
                    </div>
                </div>
                <div class="entry-content">
                    <ul>
                    <li>Toàn bộ chức năng của gói tiêu chuẩn</li>
                    <li>Chức năng dịch thuật</li>
                    <li>-</li>
                    <li>Trả phí hàng tháng</li>
                    </ul>
                </div>
                <div class="btn">
                    <Link to={premium_location}>Mua ngay</Link>
                </div>
                </div>
            </div>
            {/* <!-- end of price tab-->
            <!--price tab--> */}
            <div class="plan ultimite">
                <div class="plan-inner">
                <div class="entry-title">
                    <h3>Gói trọn đời</h3>
                    <div class="price">200.000 đ
                    </div>
                </div>
                <div class="entry-content">
                    <ul>
                    <li>Toàn bộ chức năng của gói cao cấp</li>
                    <li>-</li>
                    <li>-</li>
                    <li>Trả phí 1 lần</li>
                    </ul>
                </div>
                <div class="btn">
                    <Link to={lifetime_location}>Mua ngay</Link>
                </div>
                </div>
            </div>
            {/* <!-- end of price tab--> */}
            </div>
        )
    }
}