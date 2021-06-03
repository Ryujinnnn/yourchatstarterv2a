import './Style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faCommentsDollar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Timeline, Icon, Row, Col, Divider} from 'rsuite'
import BaoKimLogo from './logo.png'
import BankLogo from './comb.jpg'
import VisaLogo from './visa-master.jpg'
const { Component } = require("react");

class ProcessPanel extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col md={12} sm={24}>
                        <Timeline className="custom-timeline" align='right'>
                            <Timeline.Item dot={<Icon icon="user-plus" size="2x" />}>
                                <br></br>
                                <p>Đăng kí tài khoản</p>
                            </Timeline.Item>
                            <Timeline.Item dot={<Icon icon="check-square" size="2x" />}>
                                <br></br>
                                <p>Chọn gói dịch vụ cần mua</p>
                            </Timeline.Item>
                            <Timeline.Item dot={<Icon icon="shopping-cart" size="2x" />}>
                                <br></br>
                                <p>Thanh toán thông qua phương thức được hỗ trợ</p>
                            </Timeline.Item>
                            <Timeline.Item dot={<Icon icon="credit-card" size="2x" />}>
                            <br></br>
                                <p>Hoàn tất thanh toán</p>
                            </Timeline.Item>
                            <Timeline.Item dot={<Icon icon="user-plus" size="2x" />}>
                            <br></br>
                                <p>Tài khoản của bạn sẽ được nâng cấp ngay sau khi giao dịch thành công</p>
                            </Timeline.Item>
                            <Timeline.Item
                            dot={
                                <Icon
                                icon="check"
                                size="2x"
                                style={{ background: '#15b215', color: '#fff' }}
                                />
                            }
                            >
                                <br></br>
                                <p>Bạn có thể tiếp tục sử dụng tài khoản đã nâng cấp của bạn ngay</p>
                            </Timeline.Item>
                        </Timeline>
                    </Col>
                    <Col md={12} sm={24} style={{textAlign: 'left'}}>
                        <div style={{marginLeft: 40, marginRight: 40}}>
                        <h4>Phương thức thanh toán được hỗ trợ</h4>
                        <Divider></Divider>
                        <p>Chúng tôi cung cấp cho bạn nhiều lựa chọn trong việc thanh toán thông qua cổng thanh toán BaoKim, bao gồm:</p>
                        <ul className='payment-method-list'> 
                            <li>Thanh toán bằng số dư BaoKim</li>
                            <img src={BaoKimLogo} height={80} style={{marginTop: 10, marginBottom: 10, borderRadius: 8}}></img>
                            <li>Thanh toán bằng thẻ ngân hàng</li>
                            <img src={BankLogo} width={500} style={{marginTop: 10, marginBottom: 10, borderRadius: 8}}></img>
                            <li>Thanh toán bằng thẻ thanh toán quốc tế</li>
                            <img src={VisaLogo} height={80} style={{marginTop: 10, marginBottom: 10, borderRadius: 8}}></img>
                        </ul>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ProcessPanel