import { Component } from "react";
import { withRouter } from "react-router";
import './Style.css'

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
        e.preventDefault();
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
            width: "10vw",
            display: "inline-block",
            float: "left"
        };

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" onChange={e => this.setState({username: e.target.value})}  placeholder="Username"/>
                    <input type="password" name="password" onChange={e => this.setState({password: e.target.value})} placeholder="Password"/>
                    <input type="password" name="confirm_password" onChange={e => this.setState({confirm_password: e.target.value})} placeholder="Comfirm Password"/>
                    <input type="text" name="email" onChange={e => this.setState({email: e.target.value})} placeholder="Email"/>
                    <button type="submit" value="Register" style={style}>Register</button>
                </form>
            </div>
        )
    }
}

export default withRouter(RegisterPrompt)