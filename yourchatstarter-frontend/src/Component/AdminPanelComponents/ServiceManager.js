import { Component, useState, useEffect } from 'react'
import { Table, Checkbox, Divider, Button, Alert  } from 'rsuite'


const InfoCard = (props) => {
    const [config, setConfig] = useState({})
    useEffect(() => {
        setConfig(props.config)
    }, [props.config])

    useEffect(() => {
        if (props.onStatusChange) props.onStatusChange(config, props.title)
    }, [config])
    

    return (
        <div style={{display: 'flex', width: 300, minHeight: 80, border: '1px solid gray', borderRadius: 10, flexDirection: 'column', padding: 20, marginRight: 20, flexGrow: 1}}>
            <div style={{flex: 1}}><b>{props.title}</b></div>
            <Divider />
            <div style={{flex: 1}}>
                <Checkbox defaultChecked={true} disabled> Chức năng giao tiếp cơ bản</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_exchange_rate || false} onChange={(val, checked) => {setConfig({...config, ask_exchange_rate: checked})}}> Chức năng tra cứu tỉ giá ngoại tệ</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_crypto || false} onChange={(val, checked) => {setConfig({...config, ask_crypto: checked})}}> Chức năng tra cứu giá tiền ảo</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_stock || false} onChange={(val, checked) => {setConfig({...config, ask_stock: checked})}}> Chức năng tra cứu chỉ số chứng khoán</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_weather || false} onChange={(val, checked) => {setConfig({...config, ask_weather: checked})}}> Chức năng tra cứu thông tin thời tiết</Checkbox>
                <Checkbox disabled={config === {}} checked={config.req_translate || false} onChange={(val, checked) => {setConfig({...config, req_translate: checked})}}> Chức năng dịch thuật</Checkbox>
                <Checkbox disabled={config === {}} checked={config.google_fallback || false} onChange={(val, checked) => {setConfig({...config, google_fallback: checked})}}> Chức năng tra cứu thông tin thường thức (Google Knowledge Graph)</Checkbox>
                <Checkbox disabled={config === {}} checked={config.wiki_fallback || false} onChange={(val, checked) => {setConfig({...config, wiki_fallback: checked})}}> Chức năng tra cứu thông tin thường thức (Wikipedia)</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_news || false} onChange={(val, checked) => {setConfig({...config, ask_news: checked})}}> Chức năng tra cứu tin báo (VNExpress RSS Board)</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_calc || false} onChange={(val, checked) => {setConfig({...config, ask_calc: checked})}}> Chức năng tính toán</Checkbox>
                <Checkbox disabled={config === {}} checked={config.ask_covid || false} onChange={(val, checked) => {setConfig({...config, ask_covid: checked})}}> Chức năng tra cứu tình hình dịch COVID-19</Checkbox>
            </div>
        </div>
    )
}

export class ServiceManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                basic: {},
                standard: {},
                premium: {},
            },
            to_save_data: {
                basic: {},
                standard: {},
                premium: {},
            },
            checkedKeys: [],
        };
        this.onStatusChange = this.onStatusChange.bind(this)
        this.onSavePreference = this.onSavePreference.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        data: {
                            basic: res.sv_list.find((val) => val.name === "basic") || {},
                            standard: res.sv_list.find((val) => val.name === "standard") || {},
                            premium: res.sv_list.find((val) => val.name === "premium") || {},
                        },
                        to_save_data: {
                            basic: res.sv_list.find((val) => val.name === "basic") || {},
                            standard: res.sv_list.find((val) => val.name === "standard") || {},
                            premium: res.sv_list.find((val) => val.name === "premium") || {},
                        }
                    })
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/service/all_service', {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const body = await response.json();
        return body;
    };

    onStatusChange(config, title) {
        if (title === "Miễn phí") {
            this.setState({to_save_data: {...this.state.to_save_data, basic: config}})
        }
        if (title === "Tiêu chuẩn") {
            this.setState({to_save_data: {...this.state.to_save_data, standard: config}})
        }
        if (title === "Cao cấp") {
            this.setState({to_save_data: {...this.state.to_save_data, premium: config}})
        }
    }

    async saveData(data) {
        const response = await fetch('/api/admin/service/save_service', {
            method: 'POST',
            headers: {
                'x-access-token': sessionStorage.getItem("token"),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();
        return res
    }

    onSavePreference() {
        const post_data = {config: [this.state.to_save_data.basic, this.state.to_save_data.standard, this.state.to_save_data.premium]}
        console.log(post_data)
        this.saveData(post_data).then((res) => {
            if (res.status !== "success") {
                Alert.error(res.desc)
                return
            }
            Alert.success(res.desc)
        })
    }

    render() {
        //console.log(this.state.data)

          
        return (
            <div style={{height: '100%', overflowY: 'scroll'}}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: "center" }}>
                    <InfoCard title="Miễn phí" config={this.state.data.basic} onStatusChange={this.onStatusChange}/>
                    <InfoCard title="Tiêu chuẩn" config={this.state.data.standard} onStatusChange={this.onStatusChange}/>
                    <InfoCard title="Cao cấp" config={this.state.data.premium} onStatusChange={this.onStatusChange}/>

                </div>
                <Divider />
                <Button appearance="primary" onClick={this.onSavePreference}>Lưu cấu hình</Button>
            </div>
        )
    }
}