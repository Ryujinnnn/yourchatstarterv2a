import picture from './cover_img.jpg'
import './Style.css'
import {Carousel, Icon} from 'rsuite';
const { Component } = require("react");

export class BigPicture extends Component {
    render() {
        const getStartedView = (
            <div className="centered">
                <h1 style={{marginBottom: 20}}>YourChatStarter</h1>
                <p style={{marginBottom: 20}}>Chatbot cung cấp thông tin ngay trên đầu ngón tay của bạn</p>
                <a href="/chat" style={{marginBottom: 20}}><button type="button" className="blueButton">Bắt đầu ngay!</button></a>
                <a href="https://github.com/Ryujinnnn/YourChatStarter/releases/download/Android-release-v2.0.6/app-release.apk" ><button type="button" className="downloadButton">
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <Icon icon="download" size='2x'/> 
                    Tải ứng dụng cho Android
                    </div> 
                </button></a>
            </div>
        )
        return (
            <Carousel className="custom-slider" style={{width: "100vw", height: "70vh"}} >
            <div className="container">
                <img
                    src="https://bizflyportal.mediacdn.vn/bizflyportal/341/470/2020/04/17/22/11/715871146813194.jpg"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://thecxinsights.com/wp-content/uploads/2020/08/Discover-the-9-Best-Chatbot-Examples-of-2020-vector-1-1.png"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://sonaagency.com/wp-content/uploads/2019/11/1_m9IJdAYW04MYh75ivpwUNA-1536x877.png"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://s3-eu-west-1.amazonaws.com/userlike-cdn-blog/do-i-need-a-chatbot/header-chat-box.png"
                    style={{width: "100vw", height: "70vh", objectFit: "cover"}}
                    alt="Chat"
                />
                {getStartedView}
            </div>
            <div className="container">
                <img
                    src="https://cdn.wedevs.com/uploads/2018/12/Chatbot-marketing-Feature-image.png"
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