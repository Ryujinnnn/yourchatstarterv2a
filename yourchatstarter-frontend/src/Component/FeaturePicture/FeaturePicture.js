import weather_example from './weather_example.jpg'
import exchange_example from './exchange_example.jpg'
import translate_example from './translate_example.jpg'
import stock_example from './stock_example.jpg'
import calculate_example from './calculate_example.jpg'
const { Component } = require("react");

class FeaturePicture extends Component {
    render() {
        return (<div>
            <img src={weather_example} alt="weather example" style={{width: "600px", height: "160px", objectFit: "cover", margin: "auto"}}></img>      
            <p style={{margin: 15}}>Giải đáp về thời tiết</p>
            <img src={exchange_example} alt="exchange example" style={{width: "600px", height: "160px", objectFit: "cover", margin: "auto"}}></img>
            <p style={{}}>Giải đáp về tỉ giá ngoại tệ</p>
            <img src={translate_example} alt="translate example" style={{width: "600px", height: "160px", objectFit: "cover", margin: "auto"}}></img>
            <p style={{}}>Giải đáp về dịch thuật</p>
            <img src={stock_example} alt="stock example" style={{width: "600px", height: "160px", objectFit: "cover", margin: "auto"}}></img>
            <p style={{}}>Giải đáp về chỉ số chứng khoán</p>
            <img src={calculate_example} alt="calculate example" style={{width: "600px", height: "160px", objectFit: "cover", margin: "auto"}}></img>
            <p style={{}}>Giải đáp về tính toán</p>
        </div>)
    }
}

export default FeaturePicture