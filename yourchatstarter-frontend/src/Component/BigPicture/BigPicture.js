import picture from './cover_img.jpg'
import './Style.css'
import {Carousel} from 'rsuite';
const { Component } = require("react");

class BigPicture extends Component {
    render() {
        const getStartedView = (
            <div className="centered">
                <h1 style={{marginBottom: 20}}>YourChatStarter</h1>
                <p style={{marginBottom: 20}}>Chatbot cung cấp thông tin ngay trên đầu ngón tay của bạn</p>
                <a href="/chat" style={{marginBottom: 20}}><button type="button" className="blueButton">Bắt đầu ngay!</button></a>
            </div>
        )
        return (
            <Carousel className="custom-slider" style={{width: "100vw", height: "70vh"}} >
            <div className="container">
                <img
                    src={picture}
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=2"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=3"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=4"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=5"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
        </Carousel>
            // <div className="">
            //     <img src={picture} alt="Chat" style={{width: "100vw", height: "70vh", objectFit: "cover"}}></img>      
            // </div>
        )
    }
}

export default BigPicture