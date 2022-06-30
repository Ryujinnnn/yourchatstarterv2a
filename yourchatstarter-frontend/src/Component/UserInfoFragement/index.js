import { Component, createRef } from "react";
import './Style.css' 
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, ButtonToolbar, Divider, DatePicker, Schema, Alert} from "rsuite";

const model = Schema.Model({
    username: Schema.Types.StringType().isRequired('Trường thông tin này là bắt buộc'),
    email: Schema.Types.StringType()
      .isEmail('Đây không phải là email hợp lệ')
      .isRequired('Trường thông tin này là bắt buộc'),
})

export class UserInfoFragment extends Component {

    constructor(props) {
        super(props)
        this.form = createRef()

        this.state = {
            formValue: {
                username: "",
                display_name: "",
                email: "",
                birthday: new Date()
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleSubmit() {

        if (this.form.current.check()) {
            //console.log(this.form.current.state.formValue)
            const formValue = this.form.current.state.formValue
            if (this.props.onSave) this.props.onSave(formValue)
        }
        else {
            Alert.error("Một số trường không hợp lệ, xin bạn kiểm tra các trường đang hiển thị lỗi")
        }
        // if (this.props.onSubmit) this.props.onSubmit()
        // else console.log("saving")
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                formValue: this.props.data
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data && (!prevProps.data || this.props.data !== prevProps.data)) {
            this.setState({
                formValue: this.props.data
            })
        }
    }

    
    render() {
        //if (!this.props.data) return (<div></div>)
        return (<div style={{padding: 20}} className="user-profile-info">
            {/* <p>Tên người dùng: {this.props.data.username}</p>
            <p>Email: {this.props.data.email}</p>
            <p>Hạn sử dụng bản cao cấp đến: {this.props.data.paid_valid_until}</p>
            <p>Trạng thái tài khoản: {this.props.data.status}</p> */}
            <h4>Thông tin người dùng</h4>
            <Divider />
            <Form layout="horizontal" ref={this.form} model={model} formValue={this.state.formValue} onChange={(v) => {this.setState({formValue: v})}} className="profile-form"> 
                <FormGroup>
                    <ControlLabel>Tên đăng nhập</ControlLabel>
                    <FormControl name="username" disabled/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên hiển thị</ControlLabel>
                    <FormControl name="display_name" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email"/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày sinh</ControlLabel>
                    <FormControl name="birthday" accepter={DatePicker} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Hạn sử dụng bản cao cấp đến</ControlLabel>
                    <p style={{margin: 10}}> <b>{(this.props.data) ? this.props.data.paid_valid_until : new Date(0).toLocaleString("vi-VN")} </b></p>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Trạng thái tài khoản</ControlLabel>
                    <p style={{margin: 10}}> <b>{(this.props.data) ? this.props.data.status : "N/A"}</b></p>
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={this.handleSubmit}>Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </div>)
    }
}