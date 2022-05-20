import { Component } from "react";
// import BlogList from "./Component/BlogList/BlogList";
// import Footer from "./Component/Footer/Footer";
import { BlogList, Footer, Header } from '../Component'

export class Blog extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <div>
                    <BlogList></BlogList>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}