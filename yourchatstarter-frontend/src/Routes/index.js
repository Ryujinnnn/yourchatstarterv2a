import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'

import Chat from '../Chat'
import Login from '../Login'
import About from '../About'
import Subscribe from '../Subscribe'
import { Component } from 'react'
import Navigation from '../Component/Navigation/Navigation'
 
class Routes extends Component {
    render() {
        return (
            <Router>
                <Navigation></Navigation>
                <Switch>
                    <Route exact path="/chat"><Chat /></Route>
                    <Route exact path="/subscribe"><Subscribe /></Route>
                    <Route exact path="/login"><Login /></Route>
                    <Route exact path="/about"><About /></Route>
                </Switch>
            </Router>
        )
    }
}

export default Routes