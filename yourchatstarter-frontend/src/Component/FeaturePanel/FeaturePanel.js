import './Style.css'
import { Row, Col, Divider } from 'rsuite'
const { Component } = require("react");

export class FeaturePanel extends Component {
    render() {
        return (
            <div className="feature-panel-container">
                <Row>
                    <Col md={12} sm={24}>
                        <div className='feature-panel-text'>
                            <h4>
                                Nền tảng chatbot cung cấp thông tin đơn giản và tiện lợi
                            </h4>
                            <Divider></Divider>
                            <p className='feature-panel-desc'>
                                Sử dụng công nghệ trí tuệ nhân tạo, chúng tôi mong muốn đem lại một giải pháp tra cứu thông tin một cách đơn giản và thân thiện. Với những tính năng như:
                            </p>
                            <ul className='feature-panel-list'>
                                <li>Tra cứu thời tiết.</li>
                                <li>Tra cứu tỉ giá ngoại tệ.</li>
                                <li>Yêu cầu dịch thuật.</li>
                                <li>Giao diện đơn giản dễ sử dụng</li>
                            </ul>
                        </div>
                    </Col>
                    <Col md={12} sm={24}>
                    <iframe width="640" height="360" title="illus"
                        src="https://www.youtube.com/embed/C5lNmbS99a0">
                    </iframe>
                    </Col>
                </Row>
            </div>
        )
    }
}
