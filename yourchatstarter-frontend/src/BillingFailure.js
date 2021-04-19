import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class BillingFailure extends Component {
    render() {
        return (
            <div>
                <div>
                    <h2>Billing Failed</h2>
                    <p>Something wrong happened when you try to make the purchase, maybe hit us up to let us know what went wrong?</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default BillingFailure;