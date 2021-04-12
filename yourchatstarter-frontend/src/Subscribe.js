import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import { SubscribeTable } from "./Component/SubscribeTable/SubscribeTable";

class Subscribe extends Component {
    render() {
        console.log("render sub screen")
        return (
            <div>
                <SubscribeTable />
                <Footer></Footer>
            </div>
        )
    }
}

export default Subscribe;