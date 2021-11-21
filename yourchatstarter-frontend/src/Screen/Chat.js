
import React, { Component } from 'react';
import { Alert, Icon } from 'rsuite'
import { SendButton, MessageBox, MessageContainer, Footer, MessageSuggestionContainer, SpeechInput, Header } from '../Component'

export class Chat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			response: '',
			post: '',
			responseToPost: '',
			messageList: [],
			context: {},
			selectedVoice: null,
            voiceList: [],

			isSpeechModalVisible: false,
		};


		this.onClickHandler = this.onClickHandler.bind(this)
		this.onTextChange = this.onTextChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.render = this.render.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.onSuggestSelection = this.onSuggestSelection.bind(this)
		this.onReceivingAudio = this.onReceivingAudio.bind(this)
		this.onChatBubbleSpeak = this.onChatBubbleSpeak.bind(this)
		this.loadVoice = this.loadVoice.bind(this)
	}

	async componentDidMount() {
		this.callApi()
			.then(res => {
				this.setState({
					response: res.express,
					context: res.context
				})
				//console.log(this.state.context)
			})
			.catch(err => console.log(err));

		this.synth = await window.speechSynthesis;
		this.synth.onvoiceschanged = this.loadVoice
	}

	async loadVoice() {
		let voiceList = this.synth.getVoices()

		let vnDefaultVoice = voiceList.findIndex((val) => val.lang === "vi-VN" && val.name.includes("Natural"))
		if (vnDefaultVoice === -1 )vnDefaultVoice = voiceList.findIndex((val) => val.lang === "vi-VN")
		if (vnDefaultVoice === -1) {
			Alert.error("Không thể tìm thấy giọng tiếng Việt")
			console.log("Cant find default vietnamese voice")
		}
		this.setState({
			voiceList: voiceList,
			selectedVoice: (vnDefaultVoice !== -1 )? voiceList[vnDefaultVoice] : null
		})
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
				'x-access-token': sessionStorage.getItem("token"),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				post: this.state.post,
				context: this.state.context,
				is_local: true,
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

		this.onChatBubbleSpeak(body.response)
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
			headers: {
				'x-access-token': sessionStorage.getItem("token")
			},
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
			messageList: [...this.state.messageList, { text: body.context.detected_msg, isFromClient: true }, { text: body.response, isFromClient: false }],
			context: body.context
		})

		this.onChatBubbleSpeak(body.response)
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

	onChatBubbleSpeak(text) {
		if (!this.state.selectedVoice) return
        let hyperlink_match = text.match(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g)
        let hyperlink_element = <p></p>
        if (hyperlink_match) {
            let hyperlink_match_entry = hyperlink_match[0]
            let comp = hyperlink_match_entry.split(" - ")
            let ref_link = comp[0].replace('[', "").trim()
            let ref_text = comp[1].replace('/]', "").trim()
            hyperlink_element = <a href={ref_link} style={{color: 'black', backgroundColor: '#44ff44', padding: 5}}>{ref_text}</a>
        }
        text = text.replace(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g, "")
		let utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = this.state.selectedVoice
        utterance.rate = 0.8
        this.synth.speak(utterance)
	}


	render() {
		return (
			<div className="Chat">
				<Header></Header>
				<MessageContainer messageList={this.state.messageList} onSpeak={this.onChatBubbleSpeak}></MessageContainer>
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