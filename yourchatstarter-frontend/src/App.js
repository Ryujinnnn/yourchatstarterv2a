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
            <title>YourChatStarter - Your informational chatbot</title>
            <meta name="description" content="Have a chatbot to answer your everyday question today"/>

            {/* <!-- Google / Search Engine Tags --> */}
            <meta itemprop="name" content="YourChatStarter - Your informational chatbot"/>
            <meta itemprop="description" content="Have a chatbot to answer your everyday question today"/>
            <meta itemprop="image" content=""/>

            {/* <!-- Facebook Meta Tags --> */}
            <meta property="og:url" content="http://www.yourchatstarter.tk"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="YourChatStarter - Your informational chatbot"/>
            <meta property="og:description" content="Have a chatbot to answer your everyday question today"/>
            <meta property="og:image" content=""/>

            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="YourChatStarter - Your informational chatbot"/>
            <meta name="twitter:description" content="Have a chatbot to answer your everyday question today"/>
            <meta name="twitter:image" content=""/>
          </Helmet>
          <Header></Header>
          <Routes></Routes>
          
      </div>
    );
  }
}

export default App;
