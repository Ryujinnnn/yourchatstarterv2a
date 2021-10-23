import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import ProfileContainer from "./Component/ProfileContainer/ProfileContainer";
import { ProfileContainer, Footer, Header } from '../Component'

export class Profile extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <ProfileContainer></ProfileContainer>
                <Footer></Footer>
            </div>
        )
    }
}