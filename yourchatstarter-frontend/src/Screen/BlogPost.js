import { Component } from "react";
import { withRouter } from 'react-router-dom'
// import BlogCardPanel from "./Component/BlogCardPanel/BlogCardPanel";
// import BriefPanel from "./Component/BriefPanel/BriefPanel";
// import Footer from "./Component/Footer/Footer";
// import GenericMarkdown from "./Component/GenericMarkdown/GenericMarkdown";
import { BlogCardPanel, BriefPanel, Footer, GenericMarkdown, Header } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class _BlogPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        };
    }
    componentDidMount() {
        this.setState({
            show: true
        })
    }

    render() {
        console.log(this.props)
        let search = this.props.location.search.substring(1);
        //TODO: use URLParamsSearch API instead
        let query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        return (
            
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={1000} classNames="about-screen-long">
                    <div>
                        <GenericMarkdown articleId={query.articleId}/>
                        <BriefPanel mode='blog'/>
                        <BlogCardPanel />
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}

export const BlogPost = withRouter(_BlogPost);