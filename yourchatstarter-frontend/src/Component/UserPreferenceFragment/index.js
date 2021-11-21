import { Component } from "react";
import { Button, Checkbox, ControlLabel, Divider, Form, FormControl, FormGroup, SelectPicker, Slider } from "rsuite";
import './Style.css' 

export class UserPreferenceFragment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speakingText: "",
            selectedVoice: null,
            voiceList: [],
            displayVoiceList: [],
        }
        this.synth = null
        this.loadVoice = this.loadVoice.bind(this)
    }

    componentDidMount() {
        this.synth = window.speechSynthesis;
        this.synth.onvoiceschanged = this.loadVoice
        this.loadVoice()
    }

    loadVoice() {
        if (!this.synth) return
        let voiceList = this.synth.getVoices()
        let displayVoiceList = []
        console.log(voiceList)
        voiceList.forEach((val, index) => {
            displayVoiceList.push({
                label: val.name,
                value: index
            })
        })
        this.setState({
            voiceList: voiceList,
            displayVoiceList: displayVoiceList,
            selectedVoice: voiceList[0]
        })
    }

    render() {
        return (<div style={{padding: 20}} className="user-profile-preference">
            <h4>Thiết lập cá nhân</h4>
            <Divider>Thiết lập dịch vụ</Divider>
            <Checkbox> Nhận thông báo từ dịch vụ</Checkbox>
            <Checkbox> Cho phép thu thập giọng nói</Checkbox>
            <Checkbox> Luôn phát âm phản hồi</Checkbox>
            <Divider>Dịch vụ phát âm</Divider>
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                <ControlLabel style={{flex: 1}}>Chọn giọng </ControlLabel>
                <SelectPicker style={{flex: 3}} data={this.state.displayVoiceList}></SelectPicker>
            </div>
            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                <ControlLabel style={{flex: 1}}>Tốc độ nói</ControlLabel>
                <div style={{padding: 20, flex: 3}}>
                    <Slider min={0.1} max={1.0} defaultValue={0.8} step={0.1} graduated tooltip={false} progress renderMark={mark => {
                        return mark;
                    }}></Slider>
                </div>
            </div>
            <Divider>Dữ liệu người dùng</Divider>
            <Button style={{marginRight: 10}}>Trả về dữ liệu người dùng</Button>
            <Button color="red">Xóa dữ liệu người dùng</Button>
        </div>)
    }
}