
import React, { Component } from 'react';
import { SendButton } from './Component/SendButton'
import { MessageBox } from './Component/MessageBox'
import { MessageContainer } from './Component/MessageContainer'
import Footer from './Component/Footer/Footer';

class Chat extends Component {
    constructor(props) {
      super(props)
      this.state = {
        response: '',
        post: '',
        responseToPost: '',
        messageList: []
      };

      this.onClickHandler = this.onClickHandler.bind(this)
      this.onTextChange = this.onTextChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.render = this.render.bind(this)
    }
  
    componentDidMount() {
      this.callApi()
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
    }
  
    callApi = async () => {
      const response = await fetch('/api/message');
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    };
  
    async handleSubmit() {
      let req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: this.state.post }),
      }
      console.log(req)
      const response = await fetch('/api/send_message', req);
      const body = await response.text();
      this.setState({
        messageList: [...this.state.messageList, {text: body, isFromClient: false}]
      })
      this.render()
    };

    onClickHandler() {
      console.log("Clicked")
      this.setState({
        messageList: [...this.state.messageList, {text: this.state.post, isFromClient: true}]
      })
      console.log(this.state.messageList)
      this.render()
      this.handleSubmit()
    }

    onTextChange(value) {
      this.setState({
        post: value
      })
    }
    
  
    render() {
      return (
        <div className="Chat">

            <MessageContainer messageList={this.state.messageList}></MessageContainer>
            <MessageBox onChange={this.onTextChange}></MessageBox>
            <SendButton text="Send" style={{float: "right"}} onAction={this.onClickHandler}></SendButton>

            <Footer></Footer>
            </div>
        );
    }
}
  
  export default Chat;