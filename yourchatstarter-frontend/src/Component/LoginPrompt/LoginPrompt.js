import { Component } from "react";
import './Style.css'
import { withRouter } from 'react-router-dom' 
import {Grid, Col, Panel, Form, FormGroup, ControlLabel, FormControl, ButtonToolbar, Button} from 'rsuite'
import { usePushNotifications } from '..'


async function loginUser(credentials) {
    return fetch('api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

class _LoginPrompt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            token: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    //TODO: pass this down to LoginScreen logic instead

    async handleSubmit(e) {
        //e.preventDefault();
        const login_result = await loginUser({
          username: this.state.username,
          password: this.state.password
        });
        if (login_result.status === "success") {
            console.log('login success')
            sessionStorage.setItem('token', login_result.token);
            this.props.history.push('/', {login_success: true})
        }
        else {
            alert(login_result.desc)
        }
    }

    render() {

        return (
            <div className='login-page custom-login'>
                <Grid fluid >
                    <Col lg={8} md={12} sm={16} xs={20} className='login-prompt'>
                        <Panel header={<h3>Đăng nhập</h3>} bordered>
                            <Form fluid onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <ControlLabel>Tên tài khoản</ControlLabel>
                                    <FormControl onChange={e => this.setState({username: e})} name="username" style={{marginLeft: -3}}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Mật khẩu</ControlLabel>
                                    <FormControl onChange={e => this.setState({password: e})} name="password" type="password" style={{marginLeft: -3}} />
                                </FormGroup>
                                <FormGroup>
                                    <ButtonToolbar>
                                        <Button appearance="primary" type="submit">Đăng nhập</Button>
                                        <Button appearance="link" href='/register'>Chưa có tài khoản? Đăng ký</Button>
                                    </ButtonToolbar>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </Col>
                </Grid>
            </div>
        )
    }
}

export const LoginPrompt = withRouter(_LoginPrompt) 