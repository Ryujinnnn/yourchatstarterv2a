import './App.css';
import React, { Component } from 'react';
import { Header } from './Component/Header/Header'
import Routes from './Routes'
import { Helmet } from "react-helmet";
 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        token: undefined
    }
}

  render() {
    return (
      <div className="App" style={{backgroundColor: "#c27ac2"}}>
          <Helmet>
            {/*<!-- HTML Meta Tags -->*/}
            <title>YourChatStarter - Chatbot cung cấp thông tin cho bạn</title>
            <meta name="description" content="Dùng chatbot để trả lời những câu hỏi thường nhật của bạn ngay hôm nay"/>

            {/* <!-- Google / Search Engine Tags --> */}
            <meta itemprop="name" content="YourChatStarter - Chatbot cung cấp thông tin cho bạn"/>
            <meta itemprop="description" content="Dùng chatbot để trả lời những câu hỏi thường nhật của bạn ngay hôm nay"/>
            <meta itemprop="image" content=""/>

            {/* <!-- Facebook Meta Tags --> */}
            <meta property="og:url" content="http://www.yourchatstarter.xyz"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="YourChatStarter - Chatbot cung cấp thông tin cho bạn"/>
            <meta property="og:description" content="Dùng chatbot để trả lời những câu hỏi thường nhật của bạn ngay hôm nay"/>
            <meta property="og:image" content=""/>

            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="YourChatStarter - Chatbot cung cấp thông tin cho bạn"/>
            <meta name="twitter:description" content="Dùng chatbot để trả lời những câu hỏi thường nhật của bạn ngay hôm nay"/>
            <meta name="twitter:image" content=""/>
          </Helmet>
          <Header></Header>
          <Routes token={this.state.token}></Routes>
          
      </div>
    );
  }
}

export default App;
