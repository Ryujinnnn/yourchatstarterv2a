import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import Chat from '../Chat'
import Login from '../Login'
import About from '../About'
import Landing from '../Landing'
import Subscribe from '../Subscribe'
import Register from '../Register'
import PaymentInfo from '../PaymentInfo'
import BillingSuccess from '../BillingSuccess'
import BillingFailure from '../BillingFailure'
import BillingHistory from '../BillingHistory'
import NotFound from '../NotFound'
import { Component } from 'react'
import Navigation from '../Component/Navigation/Navigation'
import Profile from '../Profile'
import DirectPayment from '../DirectPayment'
import Blog from '../Blog'
import BlogPost from '../BlogPost'
import { AdminPanel } from '../AdminPanel'
  

class Routes extends Component {

    render() {

        if (!sessionStorage.getItem("token")) {

            return (
                <Router>
                    <Navigation></Navigation>
                    <Switch>
                        <Route exact path="/chat"><Chat /></Route>
                        <Route exact path="/subscribe"><Subscribe /></Route>
                        <Route exact path="/login"><Login /></Route>
                        <Route exact path="/about"><About /></Route>
                        <Route exact path="/register"><Register /></Route>
                        <Route path='/payment'><Login /></Route>
                        <Route exact path='/history'><Login /></Route>
                        <Route exact path="/logout">{<Redirect exact from='/logout' to="/"/>}</Route>
                        <Route exact path='/blog'><Blog /></Route>
                        <Route path='/blog_post'><BlogPost /></Route>
                        <Route exact path="/"><Landing /></Route>
                        <Route path="*"><NotFound /></Route>
                    </Switch>
                </Router>
            )
        }
        else return (
            <Router>
                <Navigation></Navigation>
                <Switch>
                    <Route exact path="/chat"><Chat /></Route>
                    <Route exact path="/subscribe"><Subscribe /></Route>
                    <Route exact path="/login"><Landing /></Route>
                    <Route exact path="/about"><About /></Route>
                    <Route exact path="/register"><Register /></Route>
                    <Route exact path='/payment'><PaymentInfo plan={this.props.location}/></Route>
                    <Route exact path='/payment_failure'><BillingFailure /></Route>
                    <Route exact path='/payment_success'><BillingSuccess /></Route>
                    <Route exact path='/direct_payment'><DirectPayment /></Route>
                    <Route exact path='/history'><BillingHistory /></Route>
                    <Route exact path='/profile'><Profile /></Route>
                    <Route exact path="/logout">{<Redirect exact from='/logout' to="/"/>}</Route>
                    <Route exact path='/blog'><Blog /></Route>
                    <Route path='/blog_post'><BlogPost /></Route>
                    <Route exact path='/admin'><AdminPanel /></Route>
                    <Route exact path="/"><Landing /></Route>
                    <Route path="*"><NotFound /></Route>
                </Switch>
            </Router>
        )
    }
}

export default Routes