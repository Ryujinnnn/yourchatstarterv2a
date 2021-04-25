import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class About extends Component {
    render() {
        console.log("render about screen")
        return (
            <div>
                <div>
                    <h2>Về dự án</h2>
                    <p>YourChatStarter cung cấp cho bạn một chatbot cung cấp thông tin nhanh và chính xác</p>
                    <p>Sử dụng với một giao diện khung chat đơn giản và thân thiện</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default About;