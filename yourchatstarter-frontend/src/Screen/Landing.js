import { Component, useEffect } from "react";
// import Footer from "./Component/Footer/Footer";
// import BigPicture from "./Component/BigPicture/BigPicture"
// import ContentColumn from "./Component/ContentColumn/ContentColumn";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
// import FeaturePanel from "./Component/FeaturePanel/FeaturePanel";
// import {SubscribeTable} from './Component/SubscribeTable/SubscribeTable'
// import PeoplePanel from "./Component/PeoplePanel/PeoplePanel";
// import ProcessPanel from "./Component/ProcessPanel/ProcessPanel";
// import BlogCardPanel from "./Component/BlogCardPanel/BlogCardPanel";
import { Footer, BigPicture, ContentColumn, BriefPanel, FeaturePanel, SubscribeTable, PeoplePanel, ProcessPanel, BlogCardPanel, Header, usePushNotifications } from '../Component'
import { withRouter } from 'react-router-dom'

const DummyNotificationUpdater = (props) => {
    const { loading, userSubscription, userConsent, onClickSusbribeToPushNotification, onClickSendSubscriptionToPushServer } = usePushNotifications()

    useEffect(() => {
        const isConsentGranted = userConsent === 'granted'
        if (isConsentGranted) {
            onClickSusbribeToPushNotification()
        }
    }, [])

    useEffect(() => {
        //console.log('try to send subscriber update')
        //tbh im not sure why adding loading will filter out the user sub but... ok
        if (userSubscription && !loading) {
            onClickSendSubscriptionToPushServer()
        }
    }, [userSubscription])

    return (
        <div></div>
    )
}
class _Landing extends Component {

    render() {
        const location = this.props.location

        return (
            <div>
                <Header></Header>
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
                {(location.state && location.state.login_success) ? <DummyNotificationUpdater /> : <div></div>}
                <Footer></Footer>
            </div>
        )
    }
}

export const Landing = withRouter(_Landing)