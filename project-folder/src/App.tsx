import React,{useEffect,useState} from 'react';
import { Redirect, Route,useHistory } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonFooter, IonList, IonItem, IonLabel, IonListHeader, IonText } from '@ionic/react';



import Landing from './pages/Landing'
import Weather from './pages/Weather'
import Feed from './pages/Feed'
import Tabs from './pages/Tabs'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
const { Storage } = Plugins;

const App: React.FC = () => {
  const [isLoggedin,setLoginState] = useState(Boolean)
  async function isLoggedIn() {
    // check from cache if logged in
    const ret:any = await Storage.get({ key:'isLoggedIn'});
    var isUser = await JSON.parse(ret.value);
    console.log("isUser", isUser)
    return JSON.parse(isUser);
  }
  useEffect(() => {
    // see if logged in.
    isLoggedIn().then(res=> {setLoginState(res)})
    console.log(isLoggedin)
    // rereun effect if the state changes.
  },[isLoggedIn]);
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/main" component={Tabs}/>
          <Route path="/Weather" component={Weather}/>
          <Route path="/feed" component={Feed}/>
          <Route path="/landing" component={Landing} exact={true} />
          {/* if isLoggedIn go to main, else go to landing page */}
          <Route exact path="/" render={ () => <Redirect to={ isLoggedin ? '/main' : '/landing'}/>} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export class Home extends React.Component {

  state: any = {};
  props: any = {};
  constructor(props: any) {
    super(props);
  }
 
  render() {
    return (
      <IonPage>
        ...
      </IonPage >
    );
  };
}


export default App;