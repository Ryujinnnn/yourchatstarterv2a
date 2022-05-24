import { Component } from "react";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
// import Footer from "./Component/Footer/Footer";
// import { SubscribeTable } from "./Component/SubscribeTable/SubscribeTable";
import { BriefPanel, Footer, Header, SubscribeTable } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class Subscribe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        };
    }
    componentDidMount() {
        this.setState({
            show: true
        })
    }

    render() {
        console.log("render sub screen")
        return (
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <div>
                        <BriefPanel mode="pricing"></BriefPanel>
                        <SubscribeTable />
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}