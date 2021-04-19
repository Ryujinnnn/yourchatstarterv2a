import './Style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faCommentsDollar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
const { Component } = require("react");

class ContentColumn extends Component {
    render() {
        return (
            <div class="row">
                <div class="column">
                    <FontAwesomeIcon icon={faBrain} size="4x"></FontAwesomeIcon>
                    <h2>Understand</h2>
                    <p>Using advanced Natural Language Understanding engine, you have so many way to ask our chatbot</p>
                </div>
                <div class="column">
                <FontAwesomeIcon icon={faCheckCircle} size="4x"></FontAwesomeIcon>
                    <h2>Accurate</h2>
                    <p>We ensure the information we give you is up-to-date and accurate no problem</p>
                </div>
                <div class="column">
                    <FontAwesomeIcon icon={faCommentsDollar} size="4x"></FontAwesomeIcon>
                    <h2>Free</h2>
                    <p>But you can always pay a little to get rid of those ads</p>
                </div>
            </div>
        )
    }
}

export default ContentColumn