import { Component } from "react";
import './Style.css' 
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, ButtonToolbar, Divider, DatePicker} from "rsuite";

export class UserInfoFragment extends Component {
    onSaving() {
        if (this.props.onSubmit) this.props.onSubmit()
        else console.log("saving")
    }
    render() {
        if (!this.props.data) return (<div></div>)
        return (<div style={{padding: 20}} className="user-profile-info">
            {/* <p>Tên người dùng: {this.props.data.username}</p>
            <p>Email: {this.props.data.email}</p>
            <p>Hạn sử dụng bản cao cấp đến: {this.props.data.paid_valid_until}</p>
            <p>Trạng thái tài khoản: {this.props.data.status}</p> */}
            <h4>Thông tin người dùng</h4>
            <Divider />
            <Form layout="horizontal"> 
                <FormGroup>
                    <ControlLabel>Tên đăng nhập</ControlLabel>
                    <FormControl name="username" value={this.props.data.username}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên hiển thị</ControlLabel>
                    <FormControl name="display_name" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email" value={this.props.data.email}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày sinh</ControlLabel>
                    <FormControl name="birthday" accepter={DatePicker}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Hạn sử dụng bản cao cấp đến</ControlLabel>
                    <p style={{margin: 10}}> <b>{this.props.data.paid_valid_until} </b></p>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Trạng thái tài khoản</ControlLabel>
                    <p style={{margin: 10}}> <b>{this.props.data.status}</b></p>
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