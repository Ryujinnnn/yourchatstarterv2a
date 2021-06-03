import { Component } from "react";
import { withRouter } from 'react-router-dom'
import BlogCardPanel from "./Component/BlogCardPanel/BlogCardPanel";
import BriefPanel from "./Component/BriefPanel/BriefPanel";
import Footer from "./Component/Footer/Footer";
import GenericMarkdown from "./Component/GenericMarkdown/GenericMarkdown";

class BlogPost extends Component {
    render() {
        console.log(this.props)
        let search = this.props.location.search.substring(1);
        let query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        return (
            
            <div>
                <GenericMarkdown articleId={query.articleId}/>
                <BriefPanel mode='blog'/>
                <BlogCardPanel />
                <Footer></Footer>
            </div>
        )
    }
}

export default withRouter(BlogPost);