import './Style.css'
import  { Panel } from 'rsuite'
const { Component } = require("react");

class PeoplePanel extends Component {
    render() {
        return (
            <div className='people-panel-container'>
                <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 300 }}>
                    <img src="https://via.placeholder.com/240x240" height="300" alt="placeholder"/>
                    <Panel header="NGUYỄN NGỌC ĐĂNG">
                        <p>
                            Quản lý dịch vụ
                        </p>
                    </Panel>
                </Panel>
            </div>
        )
    }
}

export default PeoplePanel