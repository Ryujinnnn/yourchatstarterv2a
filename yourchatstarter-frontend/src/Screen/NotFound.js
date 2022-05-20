import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
import Image from './404.jpg'
import { Footer, Header } from '../Component'

export class NotFound extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <img src={Image} height={300} style={{objectFit: 'cover', margin: 20}}></img>
                <h1>404</h1>
                <h2>Không tìm thấy trang</h2>
                <Footer></Footer>
            </div>
        )
    }
}
