import { Component } from "react";
import {Modal, Button} from 'rsuite'
import './Style.css'

export class SpeechInput extends Component {
    constructor(props) {
        super(props)
        // this.capture_script = document.createElement('script');
        // this.capture_script.src = './capture_script.js';
        // this.capture_script.async = true;
        this.state = {
            stopped: false,
            shouldStop: false,
        }
    }

    handleSuccess(stream) {
        // console.log('success!')
        // const options = {mimeType: 'audio/webm'};
        // const recordedChunks = [];
        // const mediaRecorder = new MediaRecorder(stream, options);

        // mediaRecorder.addEventListener('dataavailable', function(e) {
        //     if (e.data.size > 0) {
        //         recordedChunks.push(e.data);
        //     console.log("data")
        // }

        // if(this.state.shouldStop === true && this.state.stopped === false) {
        //     mediaRecorder.stop();
        //     this.setState({stopped: true})
        // }
        // });

        // mediaRecorder.addEventListener('stop', function() {
        //     let data = new Blob(recordedChunks);
        //     console.log(data)
        // });

        // mediaRecorder.start();

    }

    componentDidMount() {
        console.log(navigator.mediaDevices)
        // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        //     .then(this.handleSuccess);
    }

    render() {
        return (
            <Modal show={this.props.isVisible} onHide={this.props.onRequestClose}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <audio id="player" controls style={{ display: 'none' }}></audio>
                    <p>Nói gì đó vào microphone</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        this.setState({shouldStop: true}); 
                        this.props.onRequestClose()
                        console.log('record')
                    }} appearance="primary">
                        Xác nhận
                    </Button>
                    <Button onClick={() => {
                        this.setState({shouldStop: true}); 
                        this.props.onRequestClose()
                        console.log('refuse')
                    }} appearance="subtle">
                        Hủy bỏ
                    </Button>
                </Modal.Footer>
            </Modal>
            // <form action="/send_message_speech">
            //     <input type="file" accept="audio/*" capture />
            // </form>
        )
    }
}