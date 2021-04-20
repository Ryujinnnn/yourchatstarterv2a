import { Component } from "react";
import './Style.css'
import { withRouter } from 'react-router-dom' 

async function loginUser(credentials) {
    return fetch('api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

class LoginPrompt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            token: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        e.preventDefault();
        const login_result = await loginUser({
          username: this.state.username,
          password: this.state.password
        });
        if (login_result.status === "success") {
            console.log('login success')
            sessionStorage.setItem('token', login_result.token);
            this.props.history.push('/')
        }
        else {
            alert(login_result.desc)
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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" onChange={e => this.setState({username: e.target.value})} placeholder="Username"/>
                    <input type="password" name="password" onChange={e => this.setState({password: e.target.value})} placeholder="Password"/>
                    <button type="submit" value="Login" style={style}>Login</button>
                    <a href='/register'><button type="button" style={style}>Register</button></a>
                </form>
            </div>
        )
    }
}

export default withRouter(LoginPrompt) 