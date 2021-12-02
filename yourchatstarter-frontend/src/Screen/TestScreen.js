import { Component, createRef} from "react";
import { Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, SelectPicker } from "rsuite";
// import Footer from "./Component/Footer/Footer";
// import RegisterPrompt from "./Component/RegisterPrompt/RegisterPrompt";
import { RegisterPrompt, Footer, Header, usePushNotifications, ReactSpeechRecognition } from '../Component'
import './Test.css'

const PushNotificationtestContainer = (props) => {
    const {
      userConsent,
      pushNotificationSupported,
      userSubscription,
      onClickAskUserPermission,
      onClickSusbribeToPushNotification,
      onClickSendSubscriptionToPushServer,
      pushServerSubscriptionId,
      onClickSendNotification,
      error,
      loading
    } = usePushNotifications();
  
    const Loading = ({ loading }) =>
      loading ? <div className='app-loader'>Please wait, we are loading something...</div> : null;
    const Error = ({ error }) =>
      error ? (
        <section className='app-error'>
          <h2>{error.name}</h2>
          <p>Error message : {error.message}</p>
          <p>Error code : {error.code}</p>
        </section>
      ) : null;
  
    const isConsentGranted = userConsent === 'granted';
  
    return (
      <div>
        <header>
  
          <p>Push notification are {!pushNotificationSupported && 'NOT'} supported by your device.</p>
  
          <p>
            User consent to recevie push notificaitons is <strong>{userConsent}</strong>.
          </p>
  
          <Error error={error} />
  
          <button
            disabled={!pushNotificationSupported || isConsentGranted}
            onClick={onClickAskUserPermission}>
            {isConsentGranted ? 'Consent granted' : ' Ask user permission'}
          </button>
  
          <button
            disabled={!pushNotificationSupported || !isConsentGranted || userSubscription}
            onClick={onClickSusbribeToPushNotification}>
            {userSubscription ? 'Push subscription created' : 'Create Notification subscription'}
          </button>
  
          <button
            disabled={!userSubscription || pushServerSubscriptionId}
            onClick={onClickSendSubscriptionToPushServer}>
            {pushServerSubscriptionId
              ? 'Subscrption sent to the server'
              : 'Send subscription to push server'}
          </button>
  
          {pushServerSubscriptionId && (
            <div>
              <p>The server accepted the push subscrption!</p>
              <button onClick={onClickSendNotification}>Send a notification</button>
            </div>
          )}
        </header>
      </div>
    );
  }

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
                <ReactSpeechRecognition />
                <PushNotificationtestContainer/>
                <Footer></Footer>
            </div>
        )
    }
}