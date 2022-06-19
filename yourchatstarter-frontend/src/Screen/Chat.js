
import React, { Component, createRef } from 'react';
import { Alert, Icon } from 'rsuite'
import { SendButton, MessageBox, MessageContainer, Footer, MessageSuggestionContainer, SpeechInput, Header, ReactSpeechHookWrapper } from '../Component'

async function getUserPreference() {
    return fetch('api/user/get_preference', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.getItem("token")
        },
    }).then(data => data.json())
}

function action_parser(input) {
	if (input.action === "SHOW_MAP") {
		return {
			name: "SHOW_MAP",
			coord: input.data.message.split(" ")
		}
	}
}

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
			requestListening: false,

			isSpeechModalVisible: false,
			user_preference: {
				//general setting
				allow_auto_t2s: false,
				allow_push_notification: false,
				allow_voice_recording: false,
				//t2s setting
				voice_selection: "",
				voice_rate: 0.8
			}
		};

		this.speechHookRef = createRef()

		this.onClickHandler = this.onClickHandler.bind(this)
		this.onTextChange = this.onTextChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.render = this.render.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.onSuggestSelection = this.onSuggestSelection.bind(this)
		this.onReceivingAudio = this.onReceivingAudio.bind(this)
		this.onChatBubbleSpeak = this.onChatBubbleSpeak.bind(this)
		this.loadVoice = this.loadVoice.bind(this)

		this.onSpeechResult = this.onSpeechResult.bind(this)
		this.onRequestVoice = this.onRequestVoice.bind(this)
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

		let preference_res = await getUserPreference()
		if (preference_res && preference_res.status === "success") {
			this.setState({
				user_preference: preference_res.preference
			})
		}

		this.synth = await window.speechSynthesis;
		this.synth.onvoiceschanged = this.loadVoice
	}

	async loadVoice() {
		let voiceList = this.synth.getVoices()

		if (this.state.user_preference.voice_selection !== "") {
			let voiceSelected = voiceList.findIndex((val) => val.name === this.state.user_preference.voice_selection)
			if (voiceSelected !== -1) {
				this.setState({
					voiceList: voiceList,
					selectedVoice: (voiceSelected !== -1 )? voiceList[voiceSelected] : null
				})
				return
			}
		}

		Alert.warning("Không có thiết lập giọng nói hoặc không tìm thấy giọng, tìm giọng mặc định tốt nhất...")

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
				'subscriber-id': localStorage.getItem("notificationSubId"),
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
		//console.log(body)
		let action_result = null
		if (body.action !== undefined) {
			console.log(body.action)
			action_result = action_parser(body.action)
		}
		//console.log(body.response)
		if (!body.response) {
			body.response = "Hình như mình làm rớt não ở đâu đó, bạn có thể kiểm tra kết nối đến mạng internet được không :("
		}
		this.setState({
			messageList: [...this.state.messageList, { text: body.response, isFromClient: false, additionalAction: action_result}],
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
				'x-access-token': sessionStorage.getItem("token"),
				'subscriber-id': localStorage.getItem("notificationSubId")
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

	onSpeechResult(result) {
		this.setState({
			post: result
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

	onChatBubbleSpeak(text) {
		//TODO: make onChatBubbleSpeak to only speak text content
		if (!this.state.selectedVoice || !this.state.user_preference.allow_auto_t2s) return
        // let hyperlink_match = text.match(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g)
        // let hyperlink_element = <p></p>
        // if (hyperlink_match) {
        //     let hyperlink_match_entry = hyperlink_match[0]
        //     let comp = hyperlink_match_entry.split(" - ")
        //     let ref_link = comp[0].replace('[', "").trim()
        //     let ref_text = comp[1].replace('/]', "").trim()
        //     hyperlink_element = <a href={ref_link} style={{color: 'black', backgroundColor: '#44ff44', padding: 5}}>{ref_text}</a>
        // }
        // text = text.replace(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g, "")
		//console.log('before', text)
		if (!text) return
		text = text.replace(/__|\*|\#|!*(?:\[([^\]]*)\]\([^)]*\))/g, "")
		//console.log('after', text)
		let utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = this.state.selectedVoice
        utterance.rate = this.state.user_preference.voice_rate
        this.synth.speak(utterance)
	}

	onRequestVoice() {
		// console.log(this.speechHookRef.current)
		// this.speechHookRef.current.props.onClick()
		this.setState({isSpeechModalVisible: true})
	}

	render() {
		return (
			<div className="Chat">
				<Header></Header>
				<MessageContainer messageList={this.state.messageList} onSpeak={this.onChatBubbleSpeak} ></MessageContainer>
				<MessageSuggestionContainer messageList={(this.state.context.suggestion_list) ? this.state.context.suggestion_list : []}
					onSuggestSelection={this.onSuggestSelection}></MessageSuggestionContainer>
				<MessageBox onChange={this.onTextChange} text={this.state.post} handleKeyDown={this.handleKeyPress}></MessageBox>
				<SpeechInput isVisible={this.state.isSpeechModalVisible} onRequestClose={() => {
					this.setState({isSpeechModalVisible: false})
				}} onReceivingAudio={this.onReceivingAudio}></SpeechInput>
				<div>
					<ReactSpeechHookWrapper onBinding={(ref) => this.speechHookRef.current = ref} onResult={this.onSpeechResult} onListening={() => {Alert.info("Đang nghe")}} onStopped={() => {Alert.info("Đã nghe xong")}}/>
					{/* <div onClick={this.onRequestVoice} style={{display: 'inline', marginTop: 12 }}><Icon icon='microphone' size='2x' style={{marginTop: 10, marginBottom: 10}}/></div> */}
					<SendButton text="Gửi" style={{ float: "right" }} onAction={this.onClickHandler}></SendButton>
				</div>
				
				<Footer></Footer>
			</div>
		);
	}
}