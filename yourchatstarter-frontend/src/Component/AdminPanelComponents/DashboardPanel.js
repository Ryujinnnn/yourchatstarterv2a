//TODO: This should include current active session, user activity chart
import { Component } from "react";
import { Divider } from "rsuite";
import './style.css'
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['-6h', '-5h', '-4h', '-3h', '-2h', '-1h'],
    datasets: [
        {
            label: 'Bằng chữ',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'Bằng giọng nói',
            data: [4, 2, 3, 1, 2, 3],
            fill: false,
            backgroundColor: 'rgb(132, 255, 99)',
            borderColor: 'rgba(132, 255, 99, 0.2)',
        },
    ],
};

const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const LineChart = () => (
    <Line data={data} options={options} height={60}/>
);

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
    render() {
        return (<div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: "center" }}>
                <InfoCard title="Số người dùng đang trong phiên đăng nhập" value={0}></InfoCard>
                <InfoCard title="Tổng số người dùng" value={19}></InfoCard>
            </div>
            <div style={{ width: '98%', minHeight: 80, border: '1px solid gray', borderRadius: 10, padding: 20, marginTop: 20 }}>
                <h6>Số doạn chat Chatbot đã nhận được</h6>
                <LineChart></LineChart>
            </div>
        </div>)
    }
}
