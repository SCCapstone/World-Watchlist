import { IonList, IonItem } from "@ionic/react";
import React from "react";
import './Errors.css';
import '../pages/Landing.css'

function Errors(props: {errors: string[]}) {
    let messages = props.errors.map((msg: string,
         index: number) => {return <IonItem key={index} color="danger" class="ErrorMessages">{msg}</IonItem>})
    return (<IonList>
        {messages}
    </IonList>);
}
export default Errors;