import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'
import { Component } from 'react'

import {Chat, Subscribe, Login, AboutUs, About, Register, Blog, BlogPost, Landing, NotFound, PaymentInfo, BillingFailure, BillingSuccess, BillingHistory, DirectPayment, Profile, AdminPanel, TestScreen} from '../Screen'

class Routes extends Component {

    render() {

        if (!sessionStorage.getItem("token")) {

            return (
                <Router>
                    <Switch>
                        <Route exact path="/chat"><Chat /></Route>
                        <Route exact path="/subscribe"><Subscribe /></Route>
                        <Route exact path="/login"><Login /></Route>
                        <Route exact path="/about"><AboutUs /></Route>
                        <Route exact path="/function"><About /></Route>
                        <Route exact path="/register"><Register /></Route>
                        <Route path='/payment'><Login /></Route>
                        <Route exact path='/test'><TestScreen/></Route>
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
                <Switch>
                    <Route exact path="/chat"><Chat /></Route>
                    <Route exact path="/subscribe"><Subscribe /></Route>
                    <Route exact path="/login"><Landing /></Route>
                    <Route exact path="/about"><AboutUs /></Route>
                    <Route exact path="/function"><About /></Route>
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