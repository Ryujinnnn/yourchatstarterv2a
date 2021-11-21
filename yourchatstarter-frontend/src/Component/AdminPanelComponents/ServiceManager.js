import { Component } from 'react'
import { Table, Checkbox, Divider, Button  } from 'rsuite'


const InfoCard = (props) => {
    return (
        <div style={{display: 'flex', width: 300, minHeight: 80, border: '1px solid gray', borderRadius: 10, flexDirection: 'column', padding: 20, marginRight: 20, flexGrow: 1}}>
            <div style={{flex: 1}}><b>{props.title}</b></div>
            <Divider />
            <div style={{flex: 1}}>
                <Checkbox defaultChecked={true} disabled> Chức năng giao tiếp cơ bản</Checkbox>
                <Checkbox> Chức năng tra cứu tỉ giá ngoại tệ</Checkbox>
                <Checkbox> Chức năng tra cứu giá tiền ảo</Checkbox>
                <Checkbox> Chức năng tra cứu chỉ số chứng khoán</Checkbox>
                <Checkbox> Chức năng tra cứu thông tin thời tiết</Checkbox>
                <Checkbox> Chức năng dịch thuật</Checkbox>
                <Checkbox> Chức năng tra cứu thông tin thường thức (Google Knowledge Graph)</Checkbox>
                <Checkbox> Chức năng tra cứu thông tin thường thức (Wikipedia)</Checkbox>
                <Checkbox> Chức năng tra cứu tin báo (VNExpress RSS Board)</Checkbox>
                <Checkbox> Chức năng tính toán</Checkbox>
                <Checkbox> Chức năng tra cứu tình hình dịch COVID-19</Checkbox>
            </div>
        </div>
    )
}

export class ServiceManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkedKeys: [],
        };
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        data: res.sv_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/service/all_service');
        const body = await response.json();
        return body;
    };

    handleCheck(value, checked) {
        const checkedKeys = this.state.checkedKeys;
        const nextCheckedKeys = checked
            ? [...checkedKeys, value]
            : checkedKeys.filter(item => item !== value);

        this.setState({
            checkedKeys: nextCheckedKeys
        });
    }

    render() {
        //console.log(this.state.data)

          
        return (
            <div style={{height: '100%', overflowY: 'scroll'}}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: "center" }}>
                    <InfoCard title="Miễn phí" />
                    <InfoCard title="Tiêu chuẩn" />
                    <InfoCard title="Cao cấp" />

                </div>
                <Divider />
                <Button appearance="primary">Lưu cấu hình</Button>
            </div>
        )
    }
}