import { Component } from "react";
import BlogList from "./Component/BlogList/BlogList";
import Footer from "./Component/Footer/Footer";

class Blog extends Component {
    render() {
        console.log("render about screen")
        return (
            <div>
                <div>
                    <BlogList></BlogList>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Blog;