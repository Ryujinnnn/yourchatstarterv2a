import { Component } from "react";
import MarkdownView from 'react-showdown';
import './Style.css'
import { Tag, TagGroup } from 'rsuite'

export class GenericMarkdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            time: "",
            tag: [],
            content: "",
            imageLink: "",
        }
        this.callApi = this.callApi.bind(this)
    }

    async componentDidMount() {
        console.log(this.props)
        let res = await this.callApi()

        if (res.status === "success") {
            this.setState({ 
                title: res.blog.title,
                time: res.blog.createOn,
                tag: res.blog.tag,
                content: res.blog.content,
                imageLink: res.blog.imageLink,
            })
        }
        else {
            alert(res.status)
        }
    }

    callApi = async () => {
    //get initial context
        const response = await fetch('/api/blog/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({articleId: this.props.articleId})
        })
        const body = await response.json();
        console.log(body)
        return body;
    };

    render() {
        console.log(this.state)
        const tag_group = (this.state.tag.length !== 0) ? this.state.tag.map((val, index) => {
            return (<Tag key={index} style={{backgroundColor: val.color}}>{val.name}</Tag>)
        }) : (<div></div>)

        return (
            <div className="blog-container">
                <TagGroup className="blog-tag-container">
                    {tag_group}
                </TagGroup>
                <h2 className="blog-title">{this.state.title}</h2>
                <p className="blog-date">Bài đăng lúc: {this.state.time}</p>
                <div className="md-container">
                    <MarkdownView markdown={this.state.content} options={{ tables: true, simpleLineBreaks: true}} />
                </div>
            </div>
        )
    }
}