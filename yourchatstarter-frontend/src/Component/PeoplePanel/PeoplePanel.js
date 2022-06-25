import './Style.css'
import  { Panel } from 'rsuite'
import { Component } from 'react'

export class PeoplePanel extends Component {
    render() {
        return (
            <div className='people-panel-container'>
                <Panel className='people-panel' shaded bordered bodyFill style={{ display: 'inline-block', width: 300 }}>
                    <a href="https://ibb.co/87tjH4f"><img src="https://i.ibb.co/0GvfxV6/IMG-20201226-140928.jpg" alt="IMG-20201226-140928" border="0" width={300} height={270} style={{objectFit: 'cover'}}/></a>
                    <Panel header="NGUYỄN NGỌC ĐĂNG">
                        <p>
                            Quản lý dịch vụ
                        </p>
                    </Panel>
                </Panel>

                <Panel className='people-panel' shaded bordered bodyFill style={{ display: 'inline-block', width: 300, marginLeft: 50 }}>
                <a href="https://ibb.co/D4fmTvH"><img src="https://i.ibb.co/H7TR3bf/287403467-1008486419830862-945748514456554655-n.png" alt="287403467-1008486419830862-945748514456554655-n" border="0" width={300} height={270} style={{objectFit: 'cover'}}/></a>
                    <Panel header="BẾ HẢI LONG">
                        <p>
                            Phát triển ứng dụng di động
                        </p>
                    </Panel>
                </Panel>
            </div>
        )
    }
}