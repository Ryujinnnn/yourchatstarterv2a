import { Component } from "react";
// import BlogList from "./Component/BlogList/BlogList";
// import Footer from "./Component/Footer/Footer";
import { BlogList, Footer, Header } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class Blog extends Component {
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
        return (
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={1500} classNames="about-screen-long">
                    <div>
                        <BlogList></BlogList>
                    </div>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}