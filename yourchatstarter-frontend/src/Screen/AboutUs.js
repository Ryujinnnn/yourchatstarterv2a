import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import PeoplePanel from "./Component/PeoplePanel/PeoplePanel";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
import { Footer, PeoplePanel, BriefPanel, Header } from '../Component' 
import { CSSTransition } from 'react-transition-group';

export class AboutUs extends Component {
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
        return (
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <div>
                        <BriefPanel mode="about"></BriefPanel>
                        <PeoplePanel></PeoplePanel>
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}