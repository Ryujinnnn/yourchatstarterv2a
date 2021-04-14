import './App.css';
import React, { Component } from 'react';
import { Header } from './Component/Header/Header'
import Routes from './Routes'
import { Helmet } from "react-helmet";
 

class App extends Component {

  render() {
    return (
      <div className="App" style={{backgroundColor: "#c27ac2"}}>
          <Helmet>
            {/*<!-- HTML Meta Tags -->*/}
            <title>YourChatStarter - Your friendly assistant chatbot</title>
            <meta name="description" content="A site where you can have our chatbot provide you with all the infomation you need in real life"/>

            {/* <!-- Google / Search Engine Tags --> */}
            <meta itemprop="name" content="YourChatStarter - Your friendly assistant chatbot"/>
            <meta itemprop="description" content="A site where you can have our chatbot provide you with all the infomation you need in real life"/>
            <meta itemprop="image" content=""/>

            {/* <!-- Facebook Meta Tags --> */}
            <meta property="og:url" content="http://www.yourchatstarter.tk"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="YourChatStarter - Your friendly assistant chatbot"/>
            <meta property="og:description" content="A site where you can have our chatbot provide you with all the infomation you need in real life"/>
            <meta property="og:image" content=""/>

            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="YourChatStarter - Your friendly assistant chatbot"/>
            <meta name="twitter:description" content="A site where you can have our chatbot provide you with all the infomation you need in real life"/>
            <meta name="twitter:image" content=""/>
          </Helmet>
          <Header></Header>
          <Routes></Routes>
          
      </div>
    );
  }
}

export default App;
