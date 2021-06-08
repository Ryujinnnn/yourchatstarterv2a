import './Style.css'
import  { Panel } from 'rsuite'
const { Component } = require("react");

class PeoplePanel extends Component {
    render() {
        return (
            <div className='people-panel-container'>
                <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 300 }}>
                    <a href="https://ibb.co/87tjH4f"><img src="https://i.ibb.co/0GvfxV6/IMG-20201226-140928.jpg" alt="IMG-20201226-140928" border="0" width={300}/></a>
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