import { Component } from "react";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
// import Footer from "./Component/Footer/Footer";
// import { SubscribeTable } from "./Component/SubscribeTable/SubscribeTable";
import { BriefPanel, Footer, Header, SubscribeTable } from '../Component'

export class Subscribe extends Component {
    render() {
        console.log("render sub screen")
        return (
            <div>
                <Header></Header>
                <BriefPanel mode="pricing"></BriefPanel>
                <SubscribeTable />
                <Footer></Footer>
            </div>
        )
    }
}