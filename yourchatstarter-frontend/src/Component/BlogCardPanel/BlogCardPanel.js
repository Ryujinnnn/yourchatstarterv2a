import './Style.css'
import { Col, Row, Panel, Button } from 'rsuite'
const { Component } = require("react");

const Card = props => (
    <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: '90%', height: 460}}>
        <img src={(props.imageLink)? props.imageLink : "https://via.placeholder.com/240x240"} width="100%" height={240} alt="blog" style={{objectFit: 'cover'}}/>
        <Panel style={{height: 150}} header={props.title}>
            <p style={{overflow: 'hidden', height: 100}}>
                <small>{props.desc}</small>
            </p>
        </Panel>
        <a href={"/blog_post?articleId=" + props.id}><Button style={{marginTop: 20}}>Đọc thêm</Button></a>
    </Panel>
);

export class BlogCardPanel extends Component {
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
        const response = await fetch('/api/blog/newest_blog');
        const body = await response.json();
        return body;
    };


    render() {
        const blog_list_disp = this.state.blog_list.map((val, index) => {
            return (
                <Col md={8} sm={24} style={{padding: 20}} key={index}>
                    <Card title={val.title} desc={val.desc} id={val.articleId} imageLink={val.imageLink}/>
                </Col>
            )
        })

        return (
            <div className='blogcard-panel-container'>
                <Row >
                    {blog_list_disp}
                </Row>
            </div>
        )
    }
}