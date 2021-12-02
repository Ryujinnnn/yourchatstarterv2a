import { Component, createRef } from "react";
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, ButtonToolbar, Divider, Schema, Alert} from "rsuite";
import './Style.css' 

const model = Schema.Model({
    old_password: Schema.Types.StringType().isRequired('Trường thông tin này là bắt buộc'),
    new_password: Schema.Types.StringType()
        .addRule((value) => {

            if (value.length < 8) return false
            return true;
            }, 'Mật khẩu mới quá ngắn')
        .isRequired('Trường thông tin này là bắt buộc'),
    confirm_new_password: Schema.Types.StringType()
        .addRule((value, data) => {

            if (value !== data.new_password) {
                return false;
            }

            return true;
            }, 'Mật khẩu xác nhận không đúng')
        .isRequired('Trường thông tin này là bắt buộc')
})

export class UserSecurityFragment extends Component {

    constructor(props) {
        super(props)
        this.form = createRef()
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
    }

    render() {
        return (<div style={{padding: 20}} className="user-profile-security">
            <h4>Đổi mật khẩu</h4>
            <Divider />
            <Form model={model} ref={this.form}>
                <FormGroup>
                    <ControlLabel>Mật khẩu cũ</ControlLabel>
                    <FormControl name="old_password" type="password" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Mật khẩu mới</ControlLabel>
                    <FormControl name="new_password" type="password" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Xác nhận mật khẩu mới</ControlLabel>
                    <FormControl name="confirm_new_password" type="password" />
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