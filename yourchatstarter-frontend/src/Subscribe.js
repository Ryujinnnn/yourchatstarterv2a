import { Component } from "react";
import BriefPanel from "./Component/BriefPanel/BriefPanel";
import Footer from "./Component/Footer/Footer";
import { SubscribeTable } from "./Component/SubscribeTable/SubscribeTable";

class Subscribe extends Component {
    render() {
        console.log("render sub screen")
        return (
            <div>
                <BriefPanel mode="pricing"></BriefPanel>
                <SubscribeTable />
                <Footer></Footer>
            </div>
        )
    }
}

export default Subscribe;