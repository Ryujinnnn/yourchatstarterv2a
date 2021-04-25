import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class NotFound extends Component {
    render() {
        return (
            <div>
                <h1>404</h1>
                <h2>Không tìm thấy trang</h2>
                <Footer></Footer>
            </div>
        )
    }
}

export default NotFound;