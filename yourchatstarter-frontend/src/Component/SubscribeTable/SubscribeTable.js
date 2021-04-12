import { Component } from "react";
import './Style.css'

export class SubscribeTable extends Component {
    render() {
        return(
            <div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Basic</li>
                    <li className="grey">Free</li>
                    <li>Served with Ads</li>
                    <li>Normal support</li>
                    <li>Free as long as you like</li>
                    <li>-</li>
                    <li className="grey">Free forever :D</li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Premium</li>
                    <li className="grey">$ 0.99 / month</li>
                    <li>Ad-free</li>
                    <li>Premium Support</li>
                    <li>Pay monthly</li>
                    <li>Listed in supporter list(*)</li>
                    <li className="grey"><a href="/chat" className="button">Sign Up</a></li>
                </ul>
                </div>
                <div className="columns">
                <ul className="price">
                    <li className="header">Lifetime</li>
                    <li className="grey">only $ 9.99</li>
                    <li>Ad-free</li>
                    <li>Premium Support</li>
                    <li>Pay once</li>
                    <li>Listed in supporter list</li>
                    <li className="grey"><a href="/chat" className="button">Sign Up</a></li>
                </ul>
                </div>   
            </div>
        )
    }
}