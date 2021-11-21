import { Component } from "react";
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, ButtonToolbar, Divider} from "rsuite";
import './Style.css' 

export class UserSecurityFragment extends Component {
    render() {
        return (<div style={{padding: 20}} className="user-profile-security">
            <h4>Đổi mật khẩu</h4>
            <Divider />
            <Form>
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
                        <Button appearance="primary">Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </div>)
    }
}