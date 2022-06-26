import { Component, useEffect, useRef, useState } from 'react'
import { Alert, Button, ButtonToolbar, ControlLabel, Divider, Form, FormControl, FormGroup, Icon, IconButton, Modal, Table, TagPicker, Input, InputGroup } from 'rsuite'

const { Column, HeaderCell, Cell } = Table;


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

const BlogEditor = (props) => {

    const defaultTag = [
        {label: "Chatbot", value: "Chatbot"},
        {label: "Thông báo", value: "Thông báo"},
        {label: "Hướng dẫn", value: "Hướng dẫn"},
        {label: "Lập trình", value: "Lập trình"},
        {label: "Chức năng", value: "Chức năng"},
    ]

    const [formValue, setFormValue] = useState({})

    const blogForm = useRef(null)

    async function getData(id) {
        const response = await fetch('/api/admin/blog/from_id/' + id, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.getItem("token")
            }
        });
        const res = await response.json();
        return res
    }

    async function saveData(data) {
        const response = await fetch('/api/admin/blog/save_blog', {
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

    function onSubmitBlogInfo() {
        let blogInfo = blogForm.current.state.formValue
        console.log(blogInfo)
        saveData(blogInfo).then((res) => {
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
        if (props.selectedBlogId === "") setFormValue({})
        else {
            getData(props.selectedBlogId).then((res) => {
                if (res.status !== "success") {
                    Alert.error(res.desc)
                    return
                }
                console.log(res)
                //transform tag to a displayable format
                res.blog.display_tag = []
                res.blog.tag.forEach((val) => {
                    res.blog.display_tag.push(val.name)
                    defaultTag.push({value: val.name, label: val.name})
                })
                setFormValue(res.blog)
            })
        }
    }, [props.selectedBlogId])


    return (<div className="blog-editor-modal">
        <Form layout="horizontal" onChange={(v) => setFormValue(v)} formValue={formValue} ref={blogForm}>
            <Modal.Header>
                <Modal.Title>Thông tin bài viết</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Tiêu đề</ControlLabel>
                    <FormControl name="title" value={formValue.title || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Mô tả</ControlLabel>
                    <FormControl name="desc" value={formValue.desc || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Thẻ phân loại</ControlLabel>
                    <FormControl style={{width: '100%', margin: 15, height: 36}} name="display_tag" accepter={TagPicker} on creatable data={defaultTag}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Đường dẫn tới ảnh minh họa</ControlLabel>
                    <FormControl name="imageLink" value={formValue.imageLink || ""}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Nội dung</ControlLabel>
                    <FormControl name="content" componentClass="textarea" value={formValue.content || ""} rows={10}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày tạo bài</ControlLabel>
                    <p style={{ display: 'inline-block', paddingTop: 20, paddingLeft: 15}}>{formValue.createOn || new Date().toLocaleString("vi-VN")}</p>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSubmitBlogInfo} appearance="primary">Lưu thông tin</Button>
                <Button onClick={props.onRequestClose}>Hủy thay đổi</Button>
            </Modal.Footer>
        </Form>
    </div>)
}

export class BlogManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isEditorModalVisible: false,
            selectedBlogId: "",
            deleteModalShow: false,
            needTableUpdate: false,

            searchPrompt: "",
            page: 1,
        };

        this.onEditRequest = this.onEditRequest.bind(this)
        this.onEditorHide = this.onEditorHide.bind(this)
        this.onNewBlog = this.onNewBlog.bind(this)
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
                    data: res.blog_list
                })
                //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async (query, page) => {
        let url = '/api/admin/blog/all_blog?'
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
        const response = await fetch('/api/admin/blog/from_id/' + id, {
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
            selectedBlogId: id,
            deleteModalShow: true
        })
    }
    
    onConfirmRemoveRequest() {
        if (this.state.selectedBlogId === "") return
        else {
            this.removeData(this.state.selectedBlogId).then((res) => {
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
            selectedBlogId: "",
            deleteModalShow: false
        })
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

    onNewBlog() {
        this.setState({
            selectedBlogId: "",
            isEditorModalVisible: true
        })
    }

    onEditRequest(id) {
        this.setState({
            selectedBlogId: id,
            isEditorModalVisible: true
        })
    }

    render() {
        //console.log(this.state.data)
          
        return (
            <div>
                <Modal show={this.state.deleteModalShow} onHide={this.onCloseDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Xác nhận xóa bài viết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn xóa bài viết này hay không. Hành động này không thể bị đảo ngược
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
                        <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewBlog} color="green"> Thêm mới</IconButton>
                    </div>
                </div>

                <Modal show={this.state.isEditorModalVisible} backdrop={true} onHide={this.onEditorHide} size="lg">
                    <BlogEditor selectedBlogId={this.state.selectedBlogId} onRequestClose={this.onEditorHide} 
                        onUpdateTable={() => {this.setState({needTableUpdate: true})}}/>
                </Modal>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                    <div style={{flex: 4}}>
                        <p>Đang hiển thị {this.state.data.length} bài viết được đăng tại Website này</p>
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

                    <Column width={300} align="center" fixed>
                        <HeaderCell>Tiêu đề</HeaderCell>
                        <Cell dataKey="title" />
                    </Column>

                    {/* <Column width={200} fixed>
                        <HeaderCell>Tags</HeaderCell>
                        <Cell dataKey="email" />
                    </Column> */}

                    <Column width={200}>
                        <HeaderCell>Ngày khởi tạo</HeaderCell>
                        <Cell dataKey="createOn" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Mã bài đăng</HeaderCell>
                        <Cell dataKey="articleId" />
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Hình ảnh</HeaderCell>
                        <Cell dataKey="imageLink" />
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