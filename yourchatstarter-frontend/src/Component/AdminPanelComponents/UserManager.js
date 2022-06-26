import { Component, useEffect, useRef, useState } from 'react'
import { ControlLabel, FormGroup, Modal, Table, Form, FormControl, 
    Divider, Button, IconButton, Icon, ButtonToolbar, DatePicker, SelectPicker, Alert, Input, InputGroup } from 'rsuite'
import './style.css'

const { Column, HeaderCell, Cell } = Table;

const UserInfoEditor = (props) => {
    const plan_name = [{value: "none", label: "Miễn phí"}, {value: "standard", label: "Tiêu chuẩn"}, {value: "premium", label: "Cao cấp"}]

    const [formValue, setFormValue] = useState({})

    const userForm = useRef(null)

    async function getData(id) {
        const response = await fetch('/api/admin/user/from_id/' + id, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async function saveData(data) {
        const response = await fetch('/api/admin/user/save_user', {
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

    function onSubmitUserInfo() {
        let userInfo = userForm.current.state.formValue
        saveData(userInfo).then((res) => {
            if (res.status !== "success") {
                Alert.error(res.desc)
                return
            }
            Alert.success(res.desc)
            if (props.onUpdateTable) {
                props.onUpdateTable()
            }
        })
    }


    useEffect(() => {
        if (props.selectedUserId === "") setFormValue({})
        else {
            getData(props.selectedUserId).then((res) => {
                if (res.status !== "success") {
                    Alert.error(res.desc)
                    return
                }
                setFormValue(res.user)
            })
        }
    }, [props.selectedUserId])
    
    return (<div className="user-info-modal">
        <Form layout="horizontal" onChange={(v) => setFormValue(v)} formValue={formValue} ref={userForm}>
            <Modal.Header>
                <Modal.Title>Thông tin người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Tên đăng nhập</ControlLabel>
                    <FormControl name="username" value={formValue.username || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên hiển thị</ControlLabel>
                    <FormControl name="display_name" value={formValue.display_name || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl name="email" value={formValue.email || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Mật khẩu mới</ControlLabel>
                    <FormControl name="new_password" type="password"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày sinh</ControlLabel>
                    <FormControl name="birthday" value={(formValue.birthday)? new Date(formValue.birthday) : new Date()} accepter={DatePicker} placement='topStart'></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên dịch vụ</ControlLabel>
                    <FormControl name="plan" accepter={SelectPicker} data={plan_name} value={formValue.plan}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày hết hạn dịch vụ</ControlLabel>
                    <FormControl name="paid_valid_until" accepter={DatePicker} value={(formValue.paid_valid_until)? new Date(formValue.paid_valid_until) : new Date()} placement='topStart'></FormControl>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSubmitUserInfo} appearance="primary">Lưu thông tin</Button>
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

    function handleActionDelete() {
        if (props.onRemoveRequest) props.onRemoveRequest(rowData[dataKey])
    }
    return (
        <Cell {...props}>
            <span>
                <a onClick={handleAction}> Sửa </a> |{' '}
                <a onClick={handleActionDelete}> Xóa </a>
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
            selectedUserId: "",
            deleteModalShow: false,

            searchPrompt: "",
            page: 1,
        };

        this.onEditorHide = this.onEditorHide.bind(this)
        this.onNewUser = this.onNewUser.bind(this)
        this.onEditRequest = this.onEditRequest.bind(this)
        this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this)
        this.onRemoveRequest = this.onRemoveRequest.bind(this)
        this.onConfirmRemoveRequest = this.onConfirmRemoveRequest.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log(prevState)
        if (prevState.page !== this.state.page) {
            this.requestFetch()
        }
    }

    requestFetch() {
        const query = this.state.searchPrompt
        const page = this.state.page
        this.callApi(query, page)
            .then(res => {
                    this.setState({ 
                        data: res.user_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async (query, page) => {
        let url = '/api/admin/user/all_user?'
        if (query !== "") {
            url += `query=${query}&` 
        }
        if (page > 1) {
            url += `page=${page}`
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const body = await response.json();
        return body;
    };

    async removeData(id) {
        const response = await fetch('/api/admin/user/from_id/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    onEditorHide() {
        //console.log('a')
        if (this.state.needTableUpdate) {
            this.requestFetch()
        }
        
        this.setState({
            isEditorModalVisible: false,
            needTableUpdate: false
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

    onRemoveRequest(id) {
        this.setState({
            selectedUserId: id,
            deleteModalShow: true
        })
    }
    
    onConfirmRemoveRequest() {
        if (this.state.selectedUserId === "") return
        else {
            this.removeData(this.state.selectedUserId).then((res) => {
                if (res.status !== "success") {
                    Alert.error(res.desc)
                    return
                }
                Alert.success(res.desc)
                this.requestFetch()
            })
        }
        this.onCloseDeleteModal()
    }

    onCloseDeleteModal() {
        this.setState({
            selectedUserId: "",
            deleteModalShow: false
        })
    }

    render() {
          
        return (
            <div>
                <Modal show={this.state.deleteModalShow} onHide={this.onCloseDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn xóa thông tin người dùng này hay không. Hành động này không thể bị đảo ngược
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.onConfirmRemoveRequest} appearance="primary">
                            Đồng ý
                        </Button>
                        <Button onClick={this.onCloseDeleteModal} appearance="subtle">
                            Hủy bỏ
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center'}}>
                    <div style={{flex: 4}}>
                    <InputGroup>
                        <Input onChange={(v) => this.setState({searchPrompt: v})} onPressEnter={() => {
                            if (this.state.page !== 1) {
                                this.setState({page: 1})
                            }
                            else this.requestFetch()
                        }} />
                        <InputGroup.Addon>
                            <Icon icon="search" />
                        </InputGroup.Addon>
                    </InputGroup>
                    </div>
                    <div style={{flex: 1}}>
                    <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewUser} color="green"> Thêm mới</IconButton>
                    </div>
                </div>
                
                <Modal show={this.state.isEditorModalVisible} backdrop={true} onHide={this.onEditorHide}>
                    <UserInfoEditor selectedUserId={this.state.selectedUserId} onRequestClose={this.onEditorHide}
                        onUpdateTable={() => {this.setState({needTableUpdate: true})}}/>
                </Modal>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                    <div style={{flex: 4}}>
                    <p>Đang hiển thị {this.state.data.length} người dùng đã đăng ký vào dịch vụ</p>
                    </div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Button disabled={(this.state.page <= 1)} onClick={() => {
                            this.setState({
                                page: Math.max(1, this.state.page - 1) 
                            })
                        }}>{"<<"}</Button>
                        <p>Trang {this.state.page}</p>
                        <Button disabled={this.state.data.length === 0} onClick={() => {
                            this.setState({
                                page: this.state.page + 1
                            })
                        }}>{">>"}</Button>
                    </div>
                </div>

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
                        <ActionCell dataKey="_id" onEditRequest={this.onEditRequest} onRemoveRequest={this.onRemoveRequest}/>
                    </Column>
                </Table>

            </div>
        );
    }
}