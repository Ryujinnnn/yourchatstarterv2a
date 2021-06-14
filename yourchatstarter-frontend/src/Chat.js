
import React, { Component } from 'react';
import { Icon } from 'rsuite'
import { SendButton } from './Component/SendButton'
import { MessageBox } from './Component/MessageBox'
import { MessageContainer } from './Component/MessageContainer'
import Footer from './Component/Footer/Footer';
import { MessageSuggestionContainer } from './Component/MessageSuggestionContainer';
import { SpeechInput } from './Component/SpeechInput/SpeechInput'

class Chat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			response: '',
			post: '',
			responseToPost: '',
			messageList: [],
			context: {},

			isSpeechModalVisible: false,
		};

		this.onClickHandler = this.onClickHandler.bind(this)
		this.onTextChange = this.onTextChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.render = this.render.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.onSuggestSelection = this.onSuggestSelection.bind(this)
		this.onReceivingAudio = this.onReceivingAudio.bind(this)
	}

	componentDidMount() {
		this.callApi()
			.then(res => {
				this.setState({
					response: res.express,
					context: res.context
				})
				//console.log(this.state.context)
			})
			.catch(err => console.log(err));
	}

	callApi = async () => {
		//get initial context
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
			body: JSON.stringify({
				post: this.state.post,
				token: sessionStorage.getItem('token'),
				context: this.state.context,
			}),
		}
		this.setState({
			post: ""
		})
		//console.log(req)
		const res = await fetch('/api/send_message', req);
		const body = JSON.parse(await res.text());
		console.log(body)
		//console.log(body.response)
		this.setState({
			messageList: [...this.state.messageList, { text: body.response, isFromClient: false }],
			context: body.context
		})
	};

	onSuggestSelection(message) {
		console.log(message)
		this.setState({
			post: message
		})
	}

	onClickHandler() {
		//console.log("Clicked")
		this.setState({
			messageList: [...this.state.messageList, { text: this.state.post, isFromClient: true }]
		})
		//console.log(this.state.messageList)
		this.render()
		this.handleSubmit()
	}

	async onReceivingAudio(blob) {
		//console.log(blob)

		let formData = new FormData()

		formData.append("token", sessionStorage.getItem('token'));
		formData.append("context", JSON.stringify(this.state.context))
		formData.append("data", blob)
		let req = {
			method: 'POST',
			body: formData
		}
		this.setState({
			post: ""
		})
		// for (var key of formData.entries()) {
		// 	console.log(key[0] + ', ' + key[1]);
		// }
		//console.log(req)
		const res = await fetch('/api/send_voice', req);
		const body = JSON.parse(await res.text());
		//console.log(body)
		//console.log(body.response)
		this.setState({
			messageList: [...this.state.messageList, { text: body.context.past_client_message[body.context.past_client_message.length - 1], isFromClient: true }, { text: body.response, isFromClient: false }],
			context: body.context
		})
	}

	onTextChange(value) {
		this.setState({
			post: value
		})
	}

	handleKeyPress(event) {
		//console.log(event)
		if (event.key === 'Enter') {
			this.onClickHandler()
		}
	}


	render() {
		return (
			<div className="Chat">
				<MessageContainer messageList={this.state.messageList}></MessageContainer>
				<MessageSuggestionContainer messageList={(this.state.context.suggestion_list) ? this.state.context.suggestion_list : []}
					onSuggestSelection={this.onSuggestSelection}></MessageSuggestionContainer>
				<MessageBox onChange={this.onTextChange} text={this.state.post} handleKeyDown={this.handleKeyPress}></MessageBox>
				<SpeechInput isVisible={this.state.isSpeechModalVisible} onRequestClose={() => {
					this.setState({isSpeechModalVisible: false})
				}} onReceivingAudio={this.onReceivingAudio}></SpeechInput>
				<div>
					<div onClick={() => {this.setState({isSpeechModalVisible: true})}} style={{display: 'inline', marginTop: 12 }}><Icon icon='microphone' size='2x' style={{marginTop: 10, marginBottom: 10}}/></div>
					<SendButton text="Gửi" style={{ float: "right" }} onAction={this.onClickHandler}></SendButton>
				</div>
				<Footer></Footer>
			</div>
		);
	}
}

export default Chat;