import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'

import Chat from '../Chat'
import Login from '../Login'
import About from '../About'
import Landing from '../Landing'
import Subscribe from '../Subscribe'
import Register from '../Register'
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
                    <Route exact path="/register"><Register /></Route>
                    <Route exact path="/"><Landing /></Route>
                </Switch>
            </Router>
        )
    }
}

export default Routes