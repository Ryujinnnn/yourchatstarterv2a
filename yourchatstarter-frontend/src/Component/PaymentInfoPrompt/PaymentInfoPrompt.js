import { Component } from "react";
import './Style.css'

export class PaymentInfoPrompt extends Component {
    render() {
        const style = {
            backgroundColor: "#4CAF50",
            border: "solid lightgreen 1px",
            color: "white",
            padding: "12px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "15px",
            //borderRadius: "12px",
            width: "10vw",
            display: "inline-block",
            float: "left"
        };

        return (
            <div>
                <form action="#" method="post">
                    <input type="text" name="name" maxLength="50" placeholder="Full name"/>
                    <input type="text" name="email" maxLength="50" placeholder="Email"/>
                    <input type="text" name="phone_number" maxLength="20" placeholder="Phone number"/>
                    <input type="text" name="address" maxLength="130" placeholder="Address"/>
                    <button type="submit" value="Checkout" style={style}>Checkout</button>
                </form>
            </div>
        )
    }
}