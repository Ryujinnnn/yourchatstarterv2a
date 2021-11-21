import { Component } from "react";
import { Avatar, Icon, Nav } from "rsuite";
// import Footer from "./Component/Footer/Footer";
// import ProfileContainer from "./Component/ProfileContainer/ProfileContainer";
import { ProfileContainer, Footer, Header, UserInfoFragment, UserSecurityFragment, UserPreferenceFragment } from '../Component'

async function getUserInfo() {
    return fetch('api/user/profile', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.getItem("token")
        },
    }).then(data => data.json())
}

export class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active_panel: "profile",
            user_info_data: null
        }

        this.onTabSelect = this.onTabSelect.bind(this)
    }

    async componentDidMount() {
        const profile_result = await getUserInfo({
            token: sessionStorage.getItem("token")
        })
        if (profile_result.status === "success") {
            this.setState({
                user_info_data: profile_result.user,
            })
        }
    }

    onTabSelect(e) {
        this.setState({active_panel: e})
    }

    render() {
        let activeComponent = <div></div>
        switch (this.state.active_panel) {
            case 'profile': activeComponent = <UserInfoFragment data={this.state.user_info_data}></UserInfoFragment>; break;
            case 'security': activeComponent = <UserSecurityFragment></UserSecurityFragment>; break;
            case 'preference': activeComponent = <UserPreferenceFragment></UserPreferenceFragment>; break;
            default: 
        }
        return (
            <div>
                <Header></Header>
                {/* <ProfileContainer></ProfileContainer> */}
                <div style={{display: "flex", flexDirection: "row", padding: 20}}>
                    <div style={{flex: 1, border: '1px solid gray', borderRadius: 10, padding: 20}}>
                        <div style={{marginBottom: 20}}>
                            <Avatar circle size='lg' style={{height: 120, width: 120}}>NR</Avatar>
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
                <Footer></Footer>
            </div>
        )
    }
}