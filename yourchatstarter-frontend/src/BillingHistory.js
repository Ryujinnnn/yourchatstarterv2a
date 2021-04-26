import { Component } from "react";
import BillingTable from "./Component/BillingTable/BillingTable";
import Footer from "./Component/Footer/Footer";

class BillingHistory extends Component {
    render() {
        return (
            <div>
                <BillingTable></BillingTable>
                <Footer></Footer>
            </div>
        )
    }
}

export default BillingHistory;