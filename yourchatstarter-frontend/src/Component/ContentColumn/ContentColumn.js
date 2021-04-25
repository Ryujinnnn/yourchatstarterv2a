import './Style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faCommentsDollar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
const { Component } = require("react");

class ContentColumn extends Component {
    render() {
        return (
            <div className="row">
                <div className="column">
                    <FontAwesomeIcon icon={faBrain} size="4x"></FontAwesomeIcon>
                    <h2>Thông hiểu</h2>
                    <p>Dùng công cụ xử lý ngôn ngữ tự nhiên hiện đại, bạn có thật nhiều cách để hỏi chatbot của chúng tôi</p>
                </div>
                <div className="column">
                <FontAwesomeIcon icon={faCheckCircle} size="4x"></FontAwesomeIcon>
                    <h2>Chính xác</h2>
                    <p>Chúng tôi đảm bảo chatbot sẽ đưa ra thông tin chính xác và cập nhật</p>
                </div>
                <div className="column">
                    <FontAwesomeIcon icon={faCommentsDollar} size="4x"></FontAwesomeIcon>
                    <h2>Miễn phí</h2>
                    <p>Nhưng bạn có thể trả tiền để mở những dịch vụ cao cấp hơn</p>
                </div>
            </div>
        )
    }
}

export default ContentColumn