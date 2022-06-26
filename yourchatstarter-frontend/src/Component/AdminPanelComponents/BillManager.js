import { Component, useState, useRef, useEffect, useCallback } from 'react'
import { Divider, Icon, IconButton, Table, Alert, Form, FormControl, ControlLabel, 
    FormGroup, Modal, SelectPicker, DatePicker, Button, InputNumber, Input, InputGroup, AutoComplete} from 'rsuite'
 
const { Column, HeaderCell, Cell } = Table;

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
        //alert(`id:${rowData[dataKey]}`);

        if (props.onEditRequest) props.onEditRequest(rowData[dataKey])
    }

    function handleActionDelete() {
        //alert(`id:${rowData[dataKey]}`);

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

const BillInfoEditor = (props) => {
    const plan_name = [{value: "standard", label: "Tiêu chuẩn"}, {value: "premium", label: "Cao cấp"}, {value: "lifetime", label: "Trọn đời"}]

    const [formValue, setFormValue] = useState({})
    const trySearch = useCallback(debounce((word) => searchUser(word), 1000), [])
    const [userList, setUserList] = useState([])

    const billForm = useRef(null)

    async function getData(id) {
        const response = await fetch('/api/admin/bill/from_id/' + id, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async function saveData(data) {
        console.log(data)
        const response = await fetch('/api/admin/bill/save_bill', {
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

    function onSubmitBillInfo() {
        let billInfo = billForm.current.state.formValue
        saveData(billInfo).then((res) => {
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

    async function searchUser(query) {
        let url = '/api/admin/user/search_username?'
        if (query) {
            url += `query=${query}`
        } 
        fetch(url, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        }).then(response => response.json())
        .then(data => {
            //console.log(data.user_list);
            if (!data.user_list) return
            setUserList(data.user_list.map(x => x.username))
        })
        .catch(e => console.log(e));
    }

    useEffect(() => {
        if (props.selectedBillId === "") setFormValue({})
        else {
            getData(props.selectedBillId).then((res) => {
                if (res.status !== "success") {
                    Alert.error(res.desc)
                    return
                }
                setFormValue(res.bill)
            })
        }
    }, [props.selectedBillId])

    
    return (<div className="user-info-modal">
        <Form layout="horizontal" onChange={(v) => setFormValue(v)} formValue={formValue} ref={billForm}>
            <Modal.Header>
                <Modal.Title>Thông tin hóa đơn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Tên đăng nhập</ControlLabel>
                    <FormControl name="username" accepter={AutoComplete} value={formValue.username || ""} 
                        data={userList} onChange={(v) => {trySearch(v)}}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày tạo hóa đơn</ControlLabel>
                    <FormControl name="created_at" value={(formValue.created_at)? new Date(formValue.created_at) : new Date()} accepter={DatePicker} placement='topStart'></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Tên dịch vụ</ControlLabel>
                    <FormControl name="plan_name" accepter={SelectPicker} data={plan_name} value={formValue.plan}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Giá trị hóa đơn</ControlLabel>
                    <FormControl name="amount" accepter={InputNumber} value={parseInt(formValue.amount) || 0}></FormControl>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSubmitBillInfo} appearance="primary">Lưu thông tin</Button>
                <Button onClick={props.onRequestClose}>Hủy thay đổi</Button>
            </Modal.Footer>
        </Form>
    </div>)
}


export class BillManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEditorModalVisible: false,
            selectedBillId: "",
            deleteModalShow: false,
            needTableUpdate: false,
            
            searchPrompt: "",
            page: 1,
        };

        this.onNewBill = this.onNewBill.bind(this)
        this.onEditRequest = this.onEditRequest.bind(this)
        this.onEditorHide = this.onEditorHide.bind(this)
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
                if (res.status !== "success") return
                this.setState({ 
                    data: res.bill_list
                })
                //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async (query, page) => {
        let url = '/api/admin/bill/all_bill?'
        if (query !== "") {
            url += `query=${query}&` 
        }
        if (page > 1) {
            url += `page=${page}`
        }
        console.log(url)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const body = await response.json();
        return body;
    };

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
    
    onNewBill() {
        this.setState({
            selectedBillId: "",
            isEditorModalVisible: true
        })
    }

    onEditRequest(id) {
        this.setState({
            selectedBillId: id,
            isEditorModalVisible: true
        })
    }

    async removeData(id) {
        const response = await fetch('/api/admin/bill/from_id/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    onRemoveRequest(id) {
        this.setState({
            selectedBillId: id,
            deleteModalShow: true
        })
    }
    
    onConfirmRemoveRequest() {
        if (this.state.selectedBillId === "") return
        else {
            this.removeData(this.state.selectedBillId).then((res) => {
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
            selectedBillId: "",
            deleteModalShow: false
        })
    }


    render() {
        //console.log(this.state.data)
          
        return (
            <div>
                <Modal show={this.state.isEditorModalVisible} backdrop={true} onHide={this.onEditorHide} size="sm">
                    <BillInfoEditor selectedBillId={this.state.selectedBillId} onRequestClose={this.onEditorHide} 
                        onUpdateTable={() => {this.setState({needTableUpdate: true})}}/>
                </Modal>

                <Modal show={this.state.deleteModalShow} onHide={this.onCloseDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Xác nhận xóa hóa đơn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn xóa hóa đơn này hay không. Hành động này không thể bị đảo ngược
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
                        <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewBill} color="green"> Thêm mới</IconButton>
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                    <div style={{flex: 4}}>
                        <p>Đang hiển thị {this.state.data.length} hóa đơn thanh toán dịch vụ hệ thống</p>
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
                    onRowClick={data => {
                        console.log(data);
                    }}
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
                        <HeaderCell>Tên sản phẩm</HeaderCell>
                        <Cell dataKey="plan_name" />
                    </Column>

                    <Column width={200}>
                        <HeaderCell>Ngày tạo hóa đơn</HeaderCell>
                        <Cell dataKey="created_at" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Số tiền</HeaderCell>
                        <Cell dataKey="amount" />
                    </Column>
                    <Column width={120} fixed="right">
                        <HeaderCell>Hành động</HeaderCell>
                        <ActionCell dataKey="_id" onEditRequest={this.onEditRequest} onRemoveRequest={this.onRemoveRequest}/>
                    </Column>
                </Table>
            </div>
        )
    }
}