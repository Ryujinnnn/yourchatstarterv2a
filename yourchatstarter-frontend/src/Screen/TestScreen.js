import { Component, createRef, useState} from "react";
import { Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, SelectPicker } from "rsuite";
// import Footer from "./Component/Footer/Footer";
// import RegisterPrompt from "./Component/RegisterPrompt/RegisterPrompt";
import { RegisterPrompt, Footer, Header } from '../Component'
import { useSpeechRecognition } from 'react-speech-kit';
import './Test.css'


  
const ReactSpeechRecognition = () => {
    const [lang, setLang] = useState('vi-VN');
    const [value, setValue] = useState('');
    const [blocked, setBlocked] = useState(false);

    const onEnd = () => {
        // You could do something here after listening has finished
    };

    const onResult = (result) => {
        setValue(result);
    };

    const changeLang = (event) => {
        setLang(event.target.value);
    };

    const onError = (event) => {
        if (event.error === 'not-allowed') {
            setBlocked(true);
        }
    };

    const { listen, listening, stop, supported } = useSpeechRecognition({
        onResult,
        onEnd,
        onError,
    });

    const toggle = listening
        ? stop
        : () => {
            setBlocked(false);
            listen({ lang });
        };

    return (
        <div className="test-recognition">
            <form id="speech-recognition-form">
                <br />
                <h4>Nhận diện giọng nói</h4>
                {!supported && (
                    <p>
                        Oh no, it looks like your browser doesn&#39;t support Speech
                        Recognition.
                    </p>
                )}
                {supported && (
                    <div>
                        <p>
                            {`Bấm "Nghe" để bắt đầu nhận diện. Sau khi nhận diện xong bấm Dừng`}
                        </p>
                        <br />
                        <label htmlFor="transcript">Kết quả</label>
                        <br />
                        <textarea
                            id="transcript"
                            name="transcript"
                            placeholder="Mình chưa nghe thấy gì cả bạn ei :v"
                            value={value}
                            rows={3}
                            //disabled
                            style={{color: 'black'}}
                        />
                        <br />
                        <button style={{color: 'black'}} disabled={blocked} type="button" onClick={toggle}>
                            {listening ? 'Dừng' : 'Nghe'}
                        </button>
                        {blocked && (
                            <p style={{ color: 'red' }}>
                                Trình duyệt của bạn đang chặn quyền truy cập microphone
                            </p>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export class TestScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speakingText: "",
            selectedVoice: null,
            recognizedVoice: "Chưa nghe bạn nói bạn ei :v",
            voiceList: [],
            displayVoiceList: [],
        }
        this.synth = window.speechSynthesis;

        this.form = createRef()
        this.requestNotification = this.requestNotification.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async componentDidMount() {
        let voiceList = await this.synth.getVoices()
        let displayVoiceList = []
        console.log(voiceList)
        voiceList.forEach((val, index) => {
            displayVoiceList.push({
                label: val.name,
                value: index
            })
        })
        this.setState({
            voiceList: voiceList,
            displayVoiceList: displayVoiceList,
            selectedVoice: voiceList[0]
        })
        //this.recognizer.on
        // this.recognizer.onstart = function() {
        //     console.log("We are listening. Try speaking into the microphone.");
        // };
        
        // this.recognizer.onspeechend = function() {
        //     // when user is done speaking
        //     this.recognizer.stop();
        // }
                      
        // // This runs when the speech recognition service returns result
        // this.recognizer.onresult = function(event) {
        //     console.log(event.results[0][0].transcript)
        // };
    }

    handleSubmit() {
        let formValue = this.form.current.getFormValue()
        console.log(formValue)
        
        let speakingText = formValue.name
        let utterance = new SpeechSynthesisUtterance(speakingText)
        utterance.voice = this.state.voiceList[formValue.selectVoiceIndex]
        utterance.rate = 0.8
        this.synth.speak(utterance)
    }

    requestNotification() {
        function checkNotificationPromise() {
            try {
                Notification.requestPermission().then();
            } catch (e) {
                return false;
            }

            return true;
        }
        async function handlePermission(permission) {
            // set the button to shown or hidden, depending on what the user answers
            if (Notification.permission === 'denied' || Notification.permission === 'default') {
                console.log('oops')
            } else {
                console.log('kek')
                const reg = await navigator.serviceWorker.getRegistration();
                var text = 'Đến giờ ăn rồi bạn ơi';
                const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
                reg.showNotification(
                    'YourChatStarter',
                    {
                        tag: timestamp, // a unique ID
                        body: text, // content of the push notification
                    }
                );
            }
        }

        // Let's check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications.");
        } else {
            if (checkNotificationPromise()) {
                Notification.requestPermission()
                    .then((permission) => {
                        handlePermission(permission);
                    })
            } else {
                Notification.requestPermission(function (permission) {
                    handlePermission(permission);
                });
            }
        }
    }

    render() {
        return (
            <div>
                <Header></Header>
                <Button onClick={this.requestNotification}>Nhắc tôi</Button>
                <Form ref={this.form} onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <FormControl name="name" placeholder="Viết thứ bạn cần nói vào đây" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Chọn giọng</ControlLabel>
                        <FormControl
                            name="selectVoiceIndex"
                            accepter={SelectPicker}
                            data={this.state.displayVoiceList}
                        />
                    </FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" type="submit">Nói</Button>
                    </ButtonToolbar>
                </Form>
                <ReactSpeechRecognition/>
                <Footer></Footer>
            </div>
        )
    }
}