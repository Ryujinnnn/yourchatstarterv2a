import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import BigPicture from "./Component/BigPicture/BigPicture"
import ContentColumn from "./Component/ContentColumn/ContentColumn";

class Landing extends Component {
    render() {
        return (
            <div>
                <BigPicture></BigPicture>\
                <ContentColumn></ContentColumn>
                <Footer></Footer>
            </div>
        )
    }
}

export default Landing