import './Style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Panel, Button, Row, Col, Tag, TagGroup} from 'rsuite'
import { Link } from 'react-router-dom'
const { Component } = require("react");

const Entry = props => {
    const tag_group = props.tag.map((val, index) => {
        return (<Tag color={val.color}>{val.name}</Tag>)
    })
    return (
        <Panel bordered bodyFill style={{margin: 20, textAlign: 'left', display: 'block', height: 240}} >
            <Row>
                <Col md={4} sm={8} style={{overflowX: 'hidden'}}>
                    <img src={(props.imageLink)? props.imageLink : "https://via.placeholder.com/240x240"} alt="blog" style={{objectFit: 'fill'}}/>
                </Col>
                <Col md={20} sm={16}  style={{overflowY: 'hidden'}}>
                    <Panel style={{textAlign: 'left', display: 'inline'}}>
                        <h5 style={{height: 40,  overflowY: 'hidden'}}>{props.title} <span  style={{color: 'gray', fontSize: 'small'}}>Bài đăng lúc: {props.time}</span></h5>
                        <TagGroup style={{height: 30}}>
                            {tag_group}
                        </TagGroup>
                        <p style={{height: 100, paddingTop: 10, paddingBottom: 10, overflowY: 'scroll'}}>{props.desc}</p>    
                    
                        <a href={"/blog_post?articleId=" + props.id} ><Button style={{marginTop: 10}}>Đọc thêm</Button></a>
                    </Panel>
                </Col>
            </Row>
        </Panel>
)}

class BlogList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blog_list: []
        }
    }

    componentDidMount() {
        this.callApi()
            .then(res => {
                    this.setState({ 
                        blog_list: res.blog_list
                    })
                    //console.log(this.state.context)
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
    //get initial context
        const response = await fetch('/api/blog/all_blog');
        const body = await response.json();
        return body;
    };


    render() {
        const blog_list_disp = this.state.blog_list.map((val, index) => {
            return (
                <Entry title={val.title} desc={val.desc} tag={val.tag} time={val.createOn} id={val.articleId} key={index}/>
            )
        })
        return (<div>
            {blog_list_disp}
        </div>)
        
    }
}

export default BlogList