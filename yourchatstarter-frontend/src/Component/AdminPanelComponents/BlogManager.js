import { Component } from 'react'
import { Button, ButtonToolbar, ControlLabel, Divider, Form, FormControl, FormGroup, Icon, IconButton, Modal, Table, TagPicker } from 'rsuite'

const { Column, HeaderCell, Cell } = Table;

const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
        //alert(`id:${rowData[dataKey]}`);

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

const BlogEditor = (props) => {
    return (<div className="blog-editor-modal">
        <Form layout="horizontal">
            <Modal.Header>
                <Modal.Title>Thông tin bài viết</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Tiêu đề</ControlLabel>
                    <FormControl name="title"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Mô tả</ControlLabel>
                    <FormControl name="desc"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Thẻ phân loại</ControlLabel>
                    <FormControl name="tag" accepter={TagPicker} size="md" creatable></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Đường dẫn tới ảnh minh họa</ControlLabel>
                    <FormControl name="thumbnail_link"></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Nội dung</ControlLabel>
                    <FormControl name="content" componentClass="textarea" rows={10}></FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Ngày tạo bài</ControlLabel>
                    <p style={{ display: 'inline-block', paddingTop: 20, paddingLeft: 15}}>{new Date().toLocaleString("vi-VN")}</p>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary">Lưu thông tin</Button>
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
            selectedBlogId: ""
        };

        this.onEditRequest = this.onEditRequest.bind(this)
        this.onEditorHide = this.onEditorHide.bind(this)
        this.onNewBlog = this.onNewBlog.bind(this)
    }

    componentDidMount() {
        this.requestFetch()
    }

    requestFetch() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        data: res.blog_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/admin/blog/all_blog');
        const body = await response.json();
        return body;
    };

    onEditorHide() {
        //console.log('a')
        this.setState({
            isEditorModalVisible: false
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
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <p>Đang có tổng cộng {this.state.data.length} bài viết được đăng tại Website này</p>
                    </div>
                    <div style={{flex: 1}}>
                        <IconButton style={{float: 'right'}} icon={<Icon icon="plus"></Icon>} onClick={this.onNewBlog} color="green"> Thêm mới</IconButton>
                    </div>
                </div>
                <Divider />
                <Modal show={this.state.isEditorModalVisible} backdrop={true} onHide={this.onEditorHide} size="lg">
                    <BlogEditor selectedBlogId={this.state.selectedBlogId} onRequestClose={this.onEditorHide} />
                </Modal>
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
                        <ActionCell dataKey="_id" onEditRequest={this.onEditRequest}/>
                    </Column>
                </Table>
            </div>
        )
    }
}