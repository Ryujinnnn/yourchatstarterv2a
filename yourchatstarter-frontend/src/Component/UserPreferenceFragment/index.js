import { Component } from "react";
import { usePushNotifications } from "..";
import { Button, Checkbox, ControlLabel, Divider, Form, FormControl, FormGroup, Icon, SelectPicker, Slider } from "rsuite";
import './Style.css' 

const NotificationSetup = (props) => {
    const {
        userConsent,
        pushNotificationSupported,
        userSubscription,
        onClickAskUserPermission,
        onClickSusbribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotification,
        error,
        loading
    } = usePushNotifications();

    const Error = ({ error }) =>
        error ? (<div>
            <Icon icon='close-circle' style={{ color: 'red' }} /><p>{error.name} - {error.message} ({error.code})</p>
        </div>
        ) : null;

    const Success = (props) => 
        <div style={{display: 'inline-block', marginLeft: 20, float: 'right'}}><Icon icon="check-circle" style={{color: 'greenyellow'}}></Icon> <p style={{display: 'inline'}}>{props.message}</p></div>
    

    const needPermission = !(userConsent || !pushNotificationSupported)
    const needSubsciption = !(!userConsent || !pushNotificationSupported || userSubscription)
    const needSendSubscriptionToServer = !(!userSubscription || pushServerSubscriptionId)

    return (<div>
        <Error error={error}></Error>
        <Button style={{marginBottom: 10}} disabled={!needPermission} onClick={onClickAskUserPermission} color="blue">Cho phép dịch vụ gửi thông báo</Button> {userConsent && <Success message="Người dùng đã cho phép"></Success>}<br/>
        <Button style={{marginBottom: 10}} disabled={!needSubsciption} onClick={onClickSusbribeToPushNotification} color="blue">Tạo địa chỉ nhận thông báo</Button> {userSubscription && <Success message="Địa chỉ đã được đăng ký"></Success>}<br/>
        <Button style={{marginBottom: 10}} disabled={!needSendSubscriptionToServer} onClick={onClickSendSubscriptionToPushServer} color="blue">Đăng ký thiết bị nhận thông báo</Button> {pushServerSubscriptionId && <Success message="Thiết bị đã có thể nhận thông báo từ dịch vụ"></Success>}
    </div>)
}

export class UserPreferenceFragment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speakingText: "",
            voiceList: [],
            displayVoiceList: [],
            formValue: {
                allow_auto_t2s: false,
                allow_push_notification: false,
                allow_voice_recording: false,
                //t2s setting
                voice_selection: "",
                voice_rate: 0.8
            }
        }
        this.synth = null
        this.loadVoice = this.loadVoice.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.synth = window.speechSynthesis;
        this.synth.onvoiceschanged = this.loadVoice
        this.loadVoice()

        if (this.props.data) {
            this.setState({
                formValue: this.props.data
            })
        }
    }

    loadVoice() {
        if (!this.synth) return
        let voiceList = this.synth.getVoices()
        let displayVoiceList = []
        //console.log(voiceList)
        voiceList.forEach((val, index) => {
            displayVoiceList.push({
                label: val.name,
                value: index
            })
        })
        this.setState({
            voiceList: voiceList,
            displayVoiceList: displayVoiceList,
        })
    }

    handleSubmit() {
        console.log(this.state.formValue)
        if (this.props.onSave) this.props.onSave(this.state.formValue)
    }

    componentDidUpdate(prevProps) {
        if (this.props.data && (!prevProps.data || this.props.data !== prevProps.data)) {
            this.setState({
                formValue: this.props.data
            })
        }
    }

    render() {

        const voiceIndex = this.state.displayVoiceList.findIndex(val => val.label === this.state.formValue.voice_selection)

        return (<div style={{padding: 20}} className="user-profile-preference">
            <h4>Thiết lập cá nhân</h4>
            <Divider>Thiết lập dịch vụ</Divider>
            <Checkbox onChange={(v, c) => {
                const formValue = this.state.formValue
                formValue.allow_push_notification = c
                this.setState({
                    formValue: formValue
                })
            }} defaultChecked={(this.props.data) ? this.props.data.allow_push_notification || false : false}> Nhận thông báo từ dịch vụ</Checkbox>
            <Checkbox onChange={(v, c) => {
                const formValue = this.state.formValue
                formValue.allow_voice_recording = c
                this.setState({
                    formValue: formValue
                })
            }} defaultChecked={(this.props.data) ? this.props.data.allow_voice_recording|| false : false}> Cho phép thu thập giọng nói</Checkbox>
            <Checkbox onChange={(v, c) => {
                const formValue = this.state.formValue
                formValue.allow_auto_t2s = c
                this.setState({
                    formValue: formValue
                })
            }} defaultChecked={(this.props.data) ? this.props.data.allow_auto_t2s || false : false} > Luôn phát âm phản hồi</Checkbox>
            <Divider>Dịch vụ nhận thông báo</Divider>
            <NotificationSetup></NotificationSetup>
            <Divider>Dịch vụ phát âm</Divider>
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                <ControlLabel style={{flex: 1}}>Chọn giọng </ControlLabel>
                <SelectPicker style={{flex: 3}} value={(voiceIndex !== -1) ? voiceIndex : 0} data={this.state.displayVoiceList} onSelect={(v, i) => {
                    const formValue = this.state.formValue
                    formValue.voice_selection = i.label
                    this.setState({
                        formValue: formValue
                    })
                }} ></SelectPicker>
            </div>
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                <ControlLabel style={{flex: 1}}>Tốc độ nói</ControlLabel>
                <div style={{padding: 20, flex: 3}}>
                    <Slider min={0.1} max={2.0} value={this.state.formValue.voice_rate} onChange={(v) => {
                        const formValue = this.state.formValue
                        formValue.voice_rate = v
                        this.setState({
                            formValue: formValue
                        })
                    }} step={0.1} graduated tooltip={false} progress renderMark={mark => {
                        return mark;
                    }}></Slider>
                </div>
            </div>
            <Divider>Dữ liệu người dùng</Divider>
            <Button style={{marginRight: 10}} appearance="primary" onClick={this.handleSubmit}>Lưu thiết lập cá nhân</Button>
            <Button style={{marginRight: 10}}>Trả về dữ liệu người dùng</Button>
            <Button color="red">Xóa dữ liệu người dùng</Button>
        </div>)
    }
}