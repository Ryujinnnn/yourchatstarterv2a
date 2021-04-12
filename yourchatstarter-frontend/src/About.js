import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class About extends Component {
    render() {
        console.log("render about screen")
        return (
            <div>
                <div>
                    <h2>About this project</h2>
                    <p>YourChatStarter provide you a chat bot companion that can answer your everyday questions</p>
                    <p>Made possible with a clean simple interface mimicking a chat window</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default About;