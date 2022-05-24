import { Component } from "react";
import { Alert, Avatar, Icon, Nav } from "rsuite";
// import Footer from "./Component/Footer/Footer";
// import ProfileContainer from "./Component/ProfileContainer/ProfileContainer";
import { ProfileContainer, Footer, Header, UserInfoFragment, UserSecurityFragment, UserPreferenceFragment } from '../Component'
import { CSSTransition } from 'react-transition-group';

async function getUserInfo() {
    return fetch('api/user/profile', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.getItem("token")
        },
    }).then(data => data.json())
}

async function getUserPreference() {
    return fetch('api/user/get_preference', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.getItem("token")
        },
    }).then(data => data.json())
}

async function saveUserProfile(profileInfo) {
    return fetch('api/user/save_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem("token")
        },
        body: JSON.stringify(profileInfo)
    }).then(data => data.json())
}

async function saveUserPreference(preferenceInfo) {
    return fetch('api/user/save_preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem("token")
        },
        body: JSON.stringify(preferenceInfo)
    }).then(data => data.json())
}

async function changePassword(passwordInfo) {
    return fetch('api/auth/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem("token")
        },
        body: JSON.stringify(passwordInfo)
    }).then(data => data.json())
}

export class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active_panel: "profile",
            user_info_data: null,
            user_preference: null,
            show: false
        }

        this.onTabSelect = this.onTabSelect.bind(this)
        this.onChangingPassword = this.onChangingPassword.bind(this)
        this.onSavingProfile = this.onSavingProfile.bind(this)
        this.onSavingPreference = this.onSavingPreference.bind(this)
    }

    async componentDidMount() {
        const profile_result = await getUserInfo()
        if (profile_result.status === "success") {
            this.setState({
                user_info_data: profile_result.user,
            })
        }

        const preference_result = await getUserPreference()
        if (preference_result.status === "success") {
            this.setState({
                user_preference: preference_result.preference
            })
        }

        this.setState({
            show: true
        })
    }

    onTabSelect(e) {
        this.setState({active_panel: e})
    }

    async onSavingProfile(profileInfo) {
        const saving_profile_res = await saveUserProfile(profileInfo)
        if (saving_profile_res.status !== "success") {
            Alert.error(saving_profile_res.desc)
            return
        }
        else {
            Alert.success("Lưu thông tin người dùng thành công")
        }
    }

    async onSavingPreference(preferenceInfo) {
        const saving_preference_res = await saveUserPreference(preferenceInfo)
        if (saving_preference_res.status !== "success") {
            Alert.error(saving_preference_res.desc)
            return
        }
        else {
            Alert.success("Lưu thiết lập cá nhân người dùng thành công")
        }
    }

    async onChangingPassword(passwordInfo) {
        const changing_password_res = await changePassword(passwordInfo)
        if (changing_password_res.status !== "success") {
            Alert.error(changing_password_res.desc)
            return
        }
        else {
            Alert.success("Đổi mật khẩu người dùng thành công")
        }
    }

    render() {
        let activeComponent = <div></div>
        switch (this.state.active_panel) {
            case 'profile': activeComponent = <UserInfoFragment data={this.state.user_info_data} onSave={this.onSavingProfile}></UserInfoFragment>; break;
            case 'security': activeComponent = <UserSecurityFragment onSave={this.onChangingPassword}></UserSecurityFragment>; break;
            case 'preference': activeComponent = <UserPreferenceFragment data={this.state.user_preference} onSave={this.onSavingPreference}></UserPreferenceFragment>; break;
            default: 
        }
        return (
            <div>
                <Header></Header>
                {/* <ProfileContainer></ProfileContainer> */}
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <div style={{display: "flex", flexDirection: "row", padding: 20}}>
                        <div style={{flex: 1, border: '1px solid gray', borderRadius: 10, padding: 20}}>
                            <div style={{marginBottom: 20}}>
                                <Avatar circle size='lg' style={{height: 120, width: 120}}>?</Avatar>
                            </div>
                            <div style={{marginBottom: 20}}>
                                <h4>{(this.state.user_info_data) ? this.state.user_info_data.username : "N/A"}</h4>
                            </div>
                            <div><p>{"Đăng ký 2 tháng trước"}</p></div>
                        </div>
                        <div style={{flex: 3, border: '1px solid gray', borderRadius: 10, marginLeft: 20, padding: 20}}>
                            <Nav activeKey={this.state.active_panel} onSelect={this.onTabSelect} appearance="tabs" justified>
                                <Nav.Item eventKey="profile">Thông tin người dùng</Nav.Item>
                                <Nav.Item eventKey="security">Bảo mật</Nav.Item>
                                <Nav.Item eventKey="preference">Thiết lập cá nhân</Nav.Item>
                            </Nav>
                            <div style={{minHeight: 300}}>
                                {activeComponent}
                            </div>

                        </div>
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}