import { Component, createRef, forwardRef, useState, useEffect, useRef} from "react";
import { useSpeechRecognition } from 'react-speech-kit';
import { Icon } from "rsuite";

export const ReactSpeechRecognition = () => {
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

export const ReactSpeechHookWrapper = (props) => {
    const [lang, setLang] = useState('vi-VN');
    const [value, setValue] = useState('');
    const [blocked, setBlocked] = useState(false);

    const onEnd = () => {
        // You could do something here after listening has finished
    };

    const onResult = (result) => {
        setValue(result);
        if (props.onResult) props.onResult(result)
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

    const onBindingButton = (el) => {
        if (props.onBinding) props.onBinding(el)
    }

    const toggle = (!supported) ?
        () => {
            if (props.onUnsupported) props.onUnsupported()
        }
        : listening
            ? () => {
                stop()
                if (props.onStopped) props.onStopped()
            }
            : () => {
                setBlocked(false);
                listen({ lang });
                if (props.onListening) props.onListening()
            };

    return (<div onClick={toggle} style={{display: 'inline', marginTop: 12 }}><Icon icon='microphone' size='2x' style={{marginTop: 10, marginBottom: 10}}/></div>)
}