//TODO: This should include current active session, user activity chart
import { Component } from "react";
import { Divider } from "rsuite";
import './style.css'
import { Line } from 'react-chartjs-2';

const data = {
    
};

const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const LineChart = (props) => {

    //console.log(props.data)

    const graph_data = {
        labels: new Array(96).fill(0).map((x, i) => `-${(24 - i / 4).toFixed(2)}h`),
        datasets: [
            {
                label: 'Tin nhắn nhận được',
                data: props.data.message_receive || [],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Ý niệm xác định',
                data: props.data.defined_intent || [],
                fill: false,
                backgroundColor: 'rgb(132, 255, 99)',
                borderColor: 'rgba(132, 255, 99, 0.2)',
            },
            {
                label: 'Điền dữ liệu',
                data: props.data.slot_filling || [],
                fill: false,
                backgroundColor: 'rgb(99, 132, 255)',
                borderColor: 'rgba(132, 255, 99, 0.2)',
            },
            {
                label: 'Tìm kiếm tự do',
                data: props.data.freeform_search || [],
                fill: false,
                backgroundColor: 'rgb(132, 255, 255)',
                borderColor: 'rgba(132, 255, 99, 0.2)',
            },
            {
                label: 'Không rõ ý niệm',
                data: props.data.unknown_intent || [],
                fill: false,
                backgroundColor: 'rgb(255, 255, 99)',
                borderColor: 'rgba(132, 255, 99, 0.2)',
            },
        ],
    }

    return (
        <Line data={graph_data} options={options} height={80}/>
    )
};

const SentimentLineChart = (props) => {

    //console.log(props.data)

    const graph_data = {
        labels: new Array(96).fill(0).map((x, i) => `-${(24 - i / 4).toFixed(2)}h`),
        datasets: [
            {
                label: 'Tích cực',
                data: props.data.positive || [],
                fill: false,
                backgroundColor: 'rgb(20, 255, 20)',
                borderColor: 'rgba(80, 255, 80, 0.2)',
            },
            {
                label: 'Trung tính',
                data: props.data.neutral || [],
                fill: false,
                backgroundColor: 'rgb(200, 200, 200)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            {
                label: 'Tiêu cực',
                data: props.data.negative || [],
                fill: false,
                backgroundColor: 'rgb(255, 20, 20)',
                borderColor: 'rgba(255, 80, 80, 0.2)',
            }
        ],
    }

    return (
        <Line data={graph_data} options={options} height={80}/>
    )
};

const InfoCard = (props) => {
    return (
        <div style={{ display: 'flex', width: 300, minHeight: 80, border: '1px solid gray', borderRadius: 10, flexDirection: 'column', padding: 20, marginRight: 20, flexGrow: 1 }}>
            <div style={{ flex: 1 }}><b>{props.title}</b></div>
            <Divider />
            <div style={{ flex: 1 }}><h4>{props.value}</h4></div>
        </div>
    )
}

export class DashboardPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_count: 0,
            subscriber_count: 0,
            schedule_count: 0,
            session_count: 0,
            timeseries_data: {
                message_receive: [],
                defined_intent: [],
                slot_filling: [],
                freeform_search: [],
                unknown_intent: []
            },
            sentiment_timeseries: {
                negative: [],
                positive: [],
                neutral: [],
            }
        };
    }

    async getUserCount() {
        const response = await fetch('/api/admin/app_stat/user_count', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async getSessionCount() {
        const response = await fetch('/api/admin/app_stat/session_count', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async getSubscriberCount() {
        const response = await fetch('/api/admin/app_stat/subcriber_count', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async getScheduleCount() {
        const response = await fetch('/api/admin/app_stat/schedule_count', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async getMessageCount() {
        const response = await fetch('/api/admin/app_stat/message_timeseries', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async componentDidMount() {
        const TIMESERIES_LENGTH = 96
        let res = await this.getUserCount().catch(e => console.log(e))
        this.setState({user_count: res.result || 0})
        res = await this.getSubscriberCount().catch(e => console.log(e))
        this.setState({subscriber_count: res.result || 0})
        res = await this.getSessionCount().catch(e => console.log(e))
        this.setState({session_count: res.result || 0})
        res = await this.getScheduleCount().catch(e => console.log(e))
        this.setState({schedule_count: res.result || 0})
        res = await this.getMessageCount().catch(e => console.log(e))
        if (res && res.status === "success") {
            let timeseries_data = this.state.timeseries_data
            let sentiment_timeseries = this.state.sentiment_timeseries
            timeseries_data.message_receive = new Array(TIMESERIES_LENGTH).fill(0)
            timeseries_data.defined_intent = new Array(TIMESERIES_LENGTH).fill(0)
            timeseries_data.slot_filling = new Array(TIMESERIES_LENGTH).fill(0)
            timeseries_data.freeform_search = new Array(TIMESERIES_LENGTH).fill(0)
            timeseries_data.unknown_intent = new Array(TIMESERIES_LENGTH).fill(0)

            sentiment_timeseries.negative = new Array(TIMESERIES_LENGTH).fill(0)
            sentiment_timeseries.neutral = new Array(TIMESERIES_LENGTH).fill(0)
            sentiment_timeseries.positive = new Array(TIMESERIES_LENGTH).fill(0)
            res.result.forEach(entry => {
                let id = Math.floor(((new Date()).valueOf() - entry._id) / 900000)
                //console.log(id)
                timeseries_data.message_receive[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.message_receive
                timeseries_data.defined_intent[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.defined_intent
                timeseries_data.slot_filling[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.slot_filling
                timeseries_data.freeform_search[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.freeform_search
                timeseries_data.unknown_intent[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.unknown_intent

                sentiment_timeseries.negative[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.negative_utterance
                sentiment_timeseries.neutral[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.neutral_utterance
                sentiment_timeseries.positive[Math.max(TIMESERIES_LENGTH - 1 - id, 0)] = entry.positive_utterance
            })
            //console.log(timeseries_data)
            this.setState({
                timeseries_data: timeseries_data,
                sentiment_timeseries: sentiment_timeseries
            })
        }
    }

    render() {
        return (<div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: "center" }}>
                <InfoCard title="Số người dùng đang trong phiên đăng nhập" value={this.state.session_count}></InfoCard>
                <InfoCard title="Tổng số người dùng" value={this.state.user_count}></InfoCard>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: "center", marginTop: 20  }}>
                <InfoCard title="Số thiết bị đăng ký nhận thông báo" value={this.state.subscriber_count}></InfoCard>
                <InfoCard title="Số tin nhắn đang chờ được gửi" value={this.state.schedule_count}></InfoCard>
            </div>
            <div style={{ width: '98%', minHeight: 80, border: '1px solid gray', borderRadius: 10, padding: 20, marginTop: 20 }}>
                <h6>Phân loại số doạn chat Chatbot đã nhận được</h6>
                <LineChart data={this.state.timeseries_data}></LineChart>
            </div>

            <div style={{ width: '98%', minHeight: 80, border: '1px solid gray', borderRadius: 10, padding: 20, marginTop: 20 }}>
                <h6>Dữ liệu sắc thái xác định qua đoạn Chat</h6>
                <SentimentLineChart data={this.state.sentiment_timeseries}></SentimentLineChart>
            </div>
        </div>)
    }
}
