import { IonList, IonItem } from "@ionic/react";
import React from "react";
import './Errors.css';
import '../pages/Landing.css'

function Errors(props: {errors: string[]}) {
    let messages = props.errors.map((msg: string,
         index: number) => {return <span key={index} className="ErrorMessages">{msg}</span>})
    return (<div className="ErrorMessageContainer">
        {messages}
    </div>);
}
export default Errors;