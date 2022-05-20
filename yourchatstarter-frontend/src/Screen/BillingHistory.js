import { Component } from "react";
// import BillingTable from "./Component/BillingTable/BillingTable";
// import Footer from "./Component/Footer/Footer";
import { BillingTable, Footer, Header } from '../Component'

export class BillingHistory extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <BillingTable></BillingTable>
                <Footer></Footer>
            </div>
        )
    }
}
