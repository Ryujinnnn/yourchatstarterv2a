import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import FeaturePicture from './Component/FeaturePicture/FeaturePicture'
import { FeaturePicture, Footer, Header } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        };
    }
    componentDidMount() {
        this.setState({
            show: true
        })
    }
    render() {
        return (
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <div>
                        <h3 style={{margin: 40}}>Về dự án</h3>
                        <p>YourChatStarter cung cấp cho bạn một chatbot cung cấp thông tin nhanh và chính xác</p>
                        <p>Sử dụng với một giao diện khung chat đơn giản và thân thiện</p>
                        <h3 style={{margin: 40}}>Chức năng</h3>
                        <FeaturePicture></FeaturePicture>
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}