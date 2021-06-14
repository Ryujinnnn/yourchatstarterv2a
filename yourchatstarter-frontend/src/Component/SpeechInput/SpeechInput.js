import { Component } from "react";
import { Modal, Button, Icon, IconButton } from 'rsuite';
import MediaCapturer from 'react-multimedia-capture';
import './Style.css'
import { bufferToWave } from "../../utils/AudioHelper";

export class SpeechInput extends Component {
    constructor(props) {
        super(props)
        // this.capture_script = document.createElement('script');
        // this.capture_script.src = './capture_script.js';
        // this.capture_script.async = true;
        this.state = {
            stopped: false,
            shouldStop: false,

            granted: false,
			rejectedReason: '',
			recording: false,
			paused: false,
        }
        this.handleGranted = this.handleGranted.bind(this);
		this.handleDenied = this.handleDenied.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.handleResume = this.handleResume.bind(this);
		this.handleStreamClose = this.handleStreamClose.bind(this);
		this.downloadAudio = this.downloadAudio.bind(this);
	}
	handleGranted() {
		this.setState({ granted: true });
		console.log('Permission Granted!');
	}
	handleDenied(err) {
		this.setState({ rejectedReason: err.name });
		console.log('Permission Denied!', err);
	}
	handleStart(stream) {
		this.setState({
			recording: true
		});

		console.log('Recording Started.');
	}

	handleStop(blob) {
		this.setState({
			recording: false
		});

		const audioContext = new AudioContext();
		const fileReader = new FileReader();

		// Set up file reader on loaded end event
		fileReader.onloadend = () => {
			const arrayBuffer = fileReader.result;// as ArrayBuffer;

			// Convert array buffer into audio buffer
			audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {

				// Do something with audioBuffer
				//console.log(audioBuffer)
				let wavBlob = bufferToWave(audioBuffer, audioBuffer.length)
				//onStop(MP3Blob,audioBuffer);
				//this.downloadAudio(wavBlob)

				this.props.onReceivingAudio(wavBlob)

			})    
		}

		//Load blob
		fileReader.readAsArrayBuffer(blob)
	}
	handlePause() {
		this.setState({
			paused: true
		});
	}
	handleResume(stream) {
		this.setState({
			paused: false
		});
	}
	handleStreamClose() {
		this.setState({
			granted: false
		});
	}
	handleError(err) {
		console.log(err);
	}
	downloadAudio(blob) {
		let url = URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.target = '_blank';
		document.body.appendChild(a);

		a.click();
	}

    componentDidMount() {
        //console.log(navigator.mediaDevices)
        // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        //     .then(this.handleSuccess);
    }

    render() {
        const granted = this.state.granted;
		const rejectedReason = this.state.rejectedReason;
		const recording = this.state.recording;
		const paused = this.state.paused;

        return (
            <MediaCapturer
					constraints={{ audio: true }}
					mimeType="audio/webm"
					timeSlice={10}
					onGranted={this.handleGranted}
					onDenied={this.handleDenied}
					onStart={this.handleStart}
					onStop={this.handleStop}
					onPause={this.handlePause}
					onResume={this.handleResume}
					onError={this.handleError} 
					onStreamClosed={this.handleStreamClose}
					render={({ request, start, stop, pause, resume }) => 
                    <Modal show={this.props.isVisible} onHide={() => {if (recording) stop(); this.props.onRequestClose()}}>
                        <Modal.Header>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{
								(!granted)? "Xin bạn hãy cung cấp quyền truy cấp microphone cho chúng tôi để sử dụng tính năng này" :
								(recording)? "Nói gì đó vào microphone rồi bấm \"Kết thúc\"" : "Bấm \"Bắt đầu\" để nói chuyện"
							}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            {!granted && <Button onClick={request}>Yêu cầu quyền truy cập microphone</Button>}
							<IconButton icon={<Icon icon="microphone" />} placement="left"
								onClick={() => {
									start()
									console.log('recording')
								}} appearance="primary"
								disabled={!granted}
								color='red'>
								Bắt đầu
							</IconButton>
							<IconButton icon={<Icon icon="stop" />} placement="left"
								onClick={() => {
									stop()
									this.props.onRequestClose()
									console.log('stopped')
								}} appearance="primary"
								disabled={!granted || !recording}
								color='blue'>
								Kết thúc
							</IconButton>
                        </Modal.Footer>
                    </Modal>
                    // <form action="/send_message_speech">
                    //     <input type="file" accept="audio/*" capture />
                    // </form>
                } />
        )
    }
}