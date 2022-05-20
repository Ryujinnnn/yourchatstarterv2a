// this should display info on the server instance, as well as API quota available
import { Component, useEffect, useState } from "react";
import { Divider, Icon, Alert } from "rsuite";
import './style.css' 

const InfoCard = (props) => {
    return (
        <div style={{ display: 'flex', width: '100%', minHeight: 80, border: '1px solid gray', borderRadius: 10, flexDirection: 'column', padding: 20, marginRight: 20, flexGrow: 1, marginBottom: 20}}>
            <div style={{ flex: 1 }}><b>{props.title}</b></div>
            <Divider />
            <div style={{ flex: 1 }}><h4>{props.value}</h4></div>
        </div>
    )
}


const APIInfoCard = (props) => {

    const [serviceHealth, setServiceHealth] = useState({})

    async function getData() {
        const response = await fetch('/api/admin/api_health/all', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    useEffect(() => {
        getData().then((res) => {
            console.log(res)
            if (res.status !== "success") {
                Alert.error(res.desc)
                return
            }
            else {
                res.service_res.server = true
                
                setServiceHealth(res.service_res)
            }
        })
    }, [])

    const HealthIcon = ({status}) => {
        if (status === true) return <Icon icon="check-circle" style={{color: 'green'}} />
        else return <Icon icon="close-circle" style={{color: 'red'}} />
    }

    return (
        <div style={{ display: 'flex', width: '100%', minHeight: 80, border: '1px solid gray', borderRadius: 10, flexDirection: 'column', padding: 20, marginRight: 20, flexGrow: 1, marginBottom: 20}}>
            <div style={{ flex: 1 }}><b>{props.title}</b></div>
            <Divider />
            <div style={{ flex: 1, lineHeight: 2}}>
                <HealthIcon status={serviceHealth.server || false} /><p style={{display: 'inline'}}> Kết nối đến Server</p><br/>
                <HealthIcon status={serviceHealth.mongodb || false} /><p style={{display: 'inline'}}> Kết nối đến cơ sở dữ liệu MongoDB</p><br/>
                <HealthIcon status={serviceHealth.weather || false} /><p style={{display: 'inline'}}> Kết nối đến OpenWeather API</p><br/>
                <HealthIcon status={serviceHealth.google || false} /><p style={{display: 'inline'}}> Kết nối đến Google Cloud API</p><br/>
                <HealthIcon status={serviceHealth.witai || false} /><p style={{display: 'inline'}}> Kết nối đến Wit.AI</p><br/>
                <HealthIcon status={serviceHealth.stock || false} /><p style={{display: 'inline'}}> Kết nối đến Twelvedata API</p><br/>
                <HealthIcon status={serviceHealth.wiki || false} /><p style={{display: 'inline'}}> Kết nối đến Wikidata API</p><br/>
                <HealthIcon status={serviceHealth.covid || false} /><p style={{display: 'inline'}}> Kết nối đến cổng thông tin dịch COVID-19</p><br/>
                <HealthIcon status={serviceHealth.news || false} /><p style={{display: 'inline'}}> Kết nối đến RSS Board của VNExpress</p><br/>
                <HealthIcon status={serviceHealth.exchange || false} /><p style={{display: 'inline'}}> Kết nối đến Exchange-API</p><br/>
                <HealthIcon status={serviceHealth.translate || false} /><p style={{display: 'inline'}}> Kết nối đến Yandex Translation API</p><br/>
            </div>
        </div>
    )
}

export class InfoPanel extends Component {
    render() {
        return (<div style={{display: "flex", flexDirection: 'row'}}>
            <div style={{flex: 1, marginRight: 20}}>
            <InfoCard title="Chế độ chạy" value="Debug"></InfoCard>
            <InfoCard title="Thời điểm nạp lại gần nhất" value={new Date().toLocaleString("vi-VN")}></InfoCard>
            </div> 
            <div style={{flex: 2}}>
            <APIInfoCard title="Tình trạng hoạt động các API"></APIInfoCard>
            </div>
        </div>)
    }
}