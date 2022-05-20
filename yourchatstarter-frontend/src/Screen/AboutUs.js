import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import PeoplePanel from "./Component/PeoplePanel/PeoplePanel";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
import { Footer, PeoplePanel, BriefPanel, Header } from '../Component' 

export class AboutUs extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <div>
                    <BriefPanel mode="about"></BriefPanel>
                    <PeoplePanel></PeoplePanel>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}