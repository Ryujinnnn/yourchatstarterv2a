import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import PeoplePanel from "./Component/PeoplePanel/PeoplePanel";
import BriefPanel from "./Component/BriefPanel/BriefPanel";

class AboutUs extends Component {
    render() {
        console.log("render about screen")
        return (
            <div>
                <div>
                    <BriefPanel mode="about"></BriefPanel>
                    <PeoplePanel></PeoplePanel>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default AboutUs;