import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import ProfileContainer from "./Component/ProfileContainer/ProfileContainer";

class Profile extends Component {
    render() {
        return (
            <div>
                <ProfileContainer></ProfileContainer>
                <Footer></Footer>
            </div>
        )
    }
}

export default Profile