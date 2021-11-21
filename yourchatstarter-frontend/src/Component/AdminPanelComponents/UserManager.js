import { Component } from 'react'
import { ControlLabel, FormGroup, Modal, Table, Form, FormControl, Divider, Button, IconButton, Icon, ButtonToolbar, DatePicker, SelectPicker } from 'rsuite'
import './style.css'

const { Column, HeaderCell, Cell } = Table;

const UserInfoEditor = (props) => {
    const plan_name = [{value: "none", label: "Miễn phí"}, {value: "standard", label: "Tiêu chuẩn"}, {value: "premium", label: "Cao cấp"}]
    return (<div className="user-info-modal">
        <Form layout="horizontal">
            <Modal.Header>
                <Modal.Title>Thông tin người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Tên đăng nhập</ControlLabel>
                    <FormControl name="username"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên hiển thị</ControlLabel>
                    <FormControl name="username"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày sinh</ControlLabel>
                    <FormControl name="birthday" accepter={DatePicker}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên dịch vụ</ControlLabel>
                    <FormControl name="plan_name" accepter={SelectPicker} data={plan_name}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày hết hạn dịch vụ</ControlLabel>
                    <FormControl name="plan_exp_date" accepter={DatePicker}></FormControl>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary">Lưu thông tin</Button>
                <Button onClick={props.onRequestClose}>Hủy thay đổi</Button>
            </Modal.Footer>
        </Form>
    </div>)
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
        // alert(`id:${rowData[dataKey]}`);

        if (props.onEditRequest) props.onEditRequest(rowData[dataKey])
    }
    return (
        <Cell {...props}>
            <span>
                <a onClick={handleAction}> Sửa </a> |{' '}
                <a onClick={handleAction}> Xóa </a>
            </span>
        </Cell>
    );
}

export class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEditorModalVisible: false,
            selectedUserId: ""
        };

        this.onEditorHide = this.onEditorHide.bind(this)
        this.onNewUser = this.onNewUser.bind(this)
        this.onEditRequest = this.onEditRequest.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        data: res.user_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/user/all_user');
        const body = await response.json();
        return body;
    };

    onEditorHide() {
        //console.log('a')
        this.setState({
            isEditorModalVisible: false
        })
    }

    onNewUser() {
        this.setState({
            selectedUserId: "",
            isEditorModalVisible: true
        })
    }

    onEditRequest(id) {
        this.setState({
            selectedUserId: id,
            isEditorModalVisible: true
        })
    }

    render() {
        //console.log(this.state.data)
          
        return (
            <div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                    <p>Có tổng cộng {this.state.data.length} người dùng đã đăng ký vào dịch vụ</p>
                    </div>
                    <div style={{flex: 1}}>
                    <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewUser} color="green"> Thêm mới</IconButton>
                    </div>
                </div>
                <Divider />
                
                <Modal show={this.state.isEditorModalVisible} backdrop={true} onHide={this.onEditorHide}>
                    <UserInfoEditor selectedUserId={this.state.selectedUserId} onRequestClose={this.onEditorHide}></UserInfoEditor>
                </Modal>
                <Table
                    height={400}
                    data={this.state.data}
                    // onRowClick={data => {
                    //     console.log(data);
                    // }}
                >
                    <Column width={180}>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="_id" />
                    </Column>

                    <Column width={200} align="center" fixed>
                        <HeaderCell>Tên đăng nhập</HeaderCell>
                        <Cell dataKey="username" />
                    </Column>

                    <Column width={200} fixed>
                        <HeaderCell>Email</HeaderCell>
                        <Cell dataKey="email" />
                    </Column>

                    <Column width={200}>
                        <HeaderCell>Ngày hết hạn dịch vụ</HeaderCell>
                        <Cell dataKey="paid_valid_until" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Tên dịch vụ</HeaderCell>
                        <Cell dataKey="plan" />
                    </Column>
                    <Column width={120} fixed="right">
                        <HeaderCell>Hành động</HeaderCell>
                        <ActionCell dataKey="_id" onEditRequest={this.onEditRequest} />
                    </Column>
                </Table>
            </div>
        );
    }
}