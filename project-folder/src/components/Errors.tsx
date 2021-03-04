import { IonList, IonItem } from "@ionic/react";
import React from "react";

function Errors(props: {errors: string[]}) {
    let messages = props.errors.map((msg: string,
         index: number) => {return <IonItem key={index}>{msg}</IonItem>})
    return (<IonList>
        {messages}
    </IonList>);
}
export default Errors;