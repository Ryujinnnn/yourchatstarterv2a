import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import FeaturePicture from './Component/FeaturePicture/FeaturePicture'

class About extends Component {
    render() {
        console.log("render about screen")
        return (
            <div>
                <div>
                    <h3 style={{margin: 40}}>Về dự án</h3>
                    <p>YourChatStarter cung cấp cho bạn một chatbot cung cấp thông tin nhanh và chính xác</p>
                    <p>Sử dụng với một giao diện khung chat đơn giản và thân thiện</p>
                    <h3 style={{margin: 40}}>Chức năng</h3>
                    <FeaturePicture></FeaturePicture>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default About;