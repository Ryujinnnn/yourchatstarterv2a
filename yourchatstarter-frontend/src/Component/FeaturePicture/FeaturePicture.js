import weather_example from './weather_example.jpg'
import exchange_example from './exchange_example.jpg'
import translate_example from './translate_example.jpg'
import stock_example from './stock_example.jpg'
import calculate_example from './calculate_example.jpg'
import covid_count_example from './covid_count_example.jpg'
import covid_announcement_example from './covid_announcement_example.jpg'
import news_example from './news_example.jpg'
import wiki_example from './wiki_example.jpg'

import { Panel } from 'rsuite'
import './Style.css'
const { Component } = require("react");

const FeatureEntry = (props) => {
    return (<div>
        <Panel style={{textAlign: 'left'}} className='feature-panel' header={props.title} bordered collapsible>
            <div className='feature-content'>
                <img src={props.imgSrc} alt={props.title} className='feature-image' /> 
                <div className='feature-info'>
                    <h4 className='feature-title'>{props.title}</h4>
                    <p className='feature-caption'>{props.desc}</p>
                </div>
            </div>
        </Panel>
    </div>)
}

class FeaturePicture extends Component {
    render() {
        return (<div>
            <FeatureEntry imgSrc={weather_example} title="Tra cứu thông tin thời tiết" 
                desc="Cho phép bạn hỏi thông tin thời tiết tại các thành phố trong nước và quốc tế (Được cung cấp bởi OpenWeather API)"/>
            <FeatureEntry imgSrc={exchange_example} title="Tra cứu tỉ giá ngoại tệ" 
                desc="Cho phép bạn chuyển loại ngoại tệ này sang loại ngoại tế khác theo tỉ giá thời gian thức (Được cung cấp bởi ForeignExchange API) - Chỉ dành cho khách hàng hạng tiêu chuẩn trở lên"/>
            <FeatureEntry imgSrc={translate_example} title="Tra cứu thông tin dịch thuật" 
                desc="Cho phép bạn dịch thuật một đoạn văn bản ngắn sang ngôn ngữ bất kỳ (Được cung cấp bởi Yandex API) - Chỉ dành cho khách hàng hạng cao cấp trở lên"/>
            <FeatureEntry imgSrc={stock_example} title="Tra cứu thông tin chứng khoán" 
                desc="Cho phép bạn tra cứu chỉ số chứng khoán của trên 2500 doanh nghiệp trên sàn chứng khoán NASDAQ (Được cung cấp bởi TwelveData API) - Chỉ dành cho khách hàng hạng tiêu chuẩn trở lên"/>
            <FeatureEntry imgSrc={calculate_example} title="Tính toán đơn giản" 
                desc="Cho phép bạn tính toán một số phép toán cơ bản (Hỗ trợ hàm tính toán như sin, cos, min, max, v.v. )"/>
            <FeatureEntry imgSrc={covid_count_example} title="Thống kê số ca COVID-19 trong nước" 
                desc="Cho phép bạn theo dõi số ca nhiễm COVID-19 trong nước theo địa phương hoặc toàn quốc (Dữ liệu được cung cấp từ trang web chính thức của bộ Y Tế)"/>
            <FeatureEntry imgSrc={covid_announcement_example} title="Tra cứu thông tin thời tiết" 
                desc="Cho phép bạn theo dõi các thông báo mới nhất về dịch COVID-19 trong nước (Dữ liệu được cung cấp từ trang web chính thức của bộ Y Tế)"/>
            <FeatureEntry imgSrc={news_example} title="Đọc điểm báo" 
                desc="Cho phép bạn đọc các điểm báo mới nhất ỏ nhiều lĩnh vực khách nhau (Cung cấp bởi VNExpress RSS)"/>
            <FeatureEntry imgSrc={wiki_example} title="Tra cứu khái niệm" 
                desc="Trả về định nghĩa Wikipedia của từ bạn đã nhắn (Được cung cấp bởi Wikidata API)"/>
        </div>)
    }
}

export default FeaturePicture