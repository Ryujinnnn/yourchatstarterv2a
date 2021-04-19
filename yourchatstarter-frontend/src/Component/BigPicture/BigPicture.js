import picture from './cover_img.jpg'
import './Style.css'
const { Component } = require("react");

class BigPicture extends Component {
    render() {
        return (
            <div className="container">
                <img src={picture} alt="Chat" style={{width: "100vw", height: "70vh", objectFit: "cover"}}></img>      
                <div className="centered">
                    <h1>YourChatStarter</h1>
                    <p>Your informational chatbot at the tip of your finger</p>
                    <a href="/chat"><button type="button" className="blueButton">Get started now!</button></a>
                </div>
            </div>
        )
    }
}

export default BigPicture