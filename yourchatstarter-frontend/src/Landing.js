import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import BigPicture from "./Component/BigPicture/BigPicture"
import ContentColumn from "./Component/ContentColumn/ContentColumn";
import BriefPanel from "./Component/BriefPanel/BriefPanel";
import FeaturePanel from "./Component/FeaturePanel/FeaturePanel";
import {SubscribeTable} from './Component/SubscribeTable/SubscribeTable'
import PeoplePanel from "./Component/PeoplePanel/PeoplePanel";
import ProcessPanel from "./Component/ProcessPanel/ProcessPanel";
import BlogCardPanel from "./Component/BlogCardPanel/BlogCardPanel";

class Landing extends Component {
    render() {
        return (
            <div>
                <BigPicture></BigPicture>
                <BriefPanel mode="service"></BriefPanel>
                <ContentColumn></ContentColumn>
                <FeaturePanel></FeaturePanel>
                <BriefPanel mode="pricing"></BriefPanel>
                <SubscribeTable></SubscribeTable>
                <BriefPanel mode="about"></BriefPanel>
                <PeoplePanel></PeoplePanel>
                <BriefPanel mode="process"></BriefPanel>
                <ProcessPanel></ProcessPanel>
                <BriefPanel mode="blog"></BriefPanel>
                <BlogCardPanel></BlogCardPanel>
                <BriefPanel mode="contact"></BriefPanel>
                <Footer></Footer>
            </div>
        )
    }
}

export default Landing