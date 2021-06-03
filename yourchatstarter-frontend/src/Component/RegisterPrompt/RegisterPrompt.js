import { Component } from "react";
import { withRouter } from "react-router";
import './Style.css'
import {Grid, Col, Panel, Form, FormGroup, ControlLabel, FormControl, ButtonToolbar, Button} from 'rsuite'

async function registerUser(credentials) {
    return fetch('api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

class RegisterPrompt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            confirm_password: "",
            email: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        const register_result = await registerUser({
          username: this.state.username,
          password: this.state.password,
          confirm_password: this.state.confirm_password,
          email: this.state.email,
        });

        if (register_result.status === "success") {
            alert('Register successful! You can now log in')
            this.props.history.push('/login')
        }
        else {
            alert(register_result.desc)
        }
    }

    render() {
        const style = {
            backgroundColor: "#4CAF50",
            border: "solid lightgreen 1px",
            color: "white",
            padding: "12px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "15px",
            //borderRadius: "12px",
            width: "100px",
            display: "inline-block",
            float: "left"
        };

        return (
            // <div>
            //     <form onSubmit={this.handleSubmit}>
            //         <input type="text" name="username" onChange={e => this.setState({username: e.target.value})}  placeholder="Tên tài khoản"/>
            //         <input type="password" name="password" onChange={e => this.setState({password: e.target.value})} placeholder="Mật khẩu"/>
            //         <input type="password" name="confirm_password" onChange={e => this.setState({confirm_password: e.target.value})} placeholder="Xác nhận mật khẩu"/>
            //         <input type="text" name="email" onChange={e => this.setState({email: e.target.value})} placeholder="Email"/>
            //         <button type="submit" value="Register" style={style}>Đăng ký</button>
            //     </form>
            // </div>
            <div className='login-page custom-register'>
            <Grid fluid justify="center">
                <Col lg={12} md={16} sm={20} xs={24} className='register-prompt'>
                    <Panel header={<h3>Đăng ký</h3>} bordered>
                        <Form fluid onSubmit={this.handleSubmit} >
                            <FormGroup style={{marginBottom: -6}} >
                                <ControlLabel style={{marginTop: 12}}>Tên tài khoản</ControlLabel>
                                <FormControl onChange={e => this.setState({username: e})} name="username" style={{marginLeft: -3}}/>
                            </FormGroup>
                            <FormGroup style={{marginBottom: -6}}>
                                <ControlLabel style={{marginTop: 12}}> Mật khẩu</ControlLabel>
                                <FormControl onChange={e => this.setState({password: e})} name="password" type="password" style={{marginLeft: -3}}/>
                            </FormGroup>
                            <FormGroup style={{marginBottom: -6}}>
                                <ControlLabel style={{marginTop: 12}}>Xác nhận Mật khẩu</ControlLabel>
                                <FormControl onChange={e => this.setState({confirm_password: e})} name="confirm_password" type="password" style={{marginLeft: -3}}/>
                            </FormGroup>
                            <FormGroup style={{marginBottom: -6}}>
                                <ControlLabel style={{marginTop: 12}}>Email</ControlLabel>
                                <FormControl onChange={e => this.setState({email: e})} name="email" style={{marginLeft: -3}}/>
                            </FormGroup>
                            <FormGroup>
                                <ButtonToolbar style={{marginTop: 12}}>
                                    <Button appearance="primary" type="submit">Đăng ký</Button>
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

export default withRouter(RegisterPrompt)