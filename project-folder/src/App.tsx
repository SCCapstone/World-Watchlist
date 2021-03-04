import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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
import { auth } from './firebase';
// import { auth } from 'firebase-admin';

async function isLoggedIn () {
  let loggedIn: (boolean|undefined) = false;
  let status = auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Logged in");
      loggedIn = true;
    } else {
      console.log("Not logged in");
      loggedIn = false;
    }
  })
  console.log(loggedIn);
  return loggedIn;
}
async function backToLogin() {
  let logged = await isLoggedIn();
  if (logged === false)
    return <Redirect exact to="/landing"/>;
}
async function skipLogin() {
  let logged = await isLoggedIn();
  if ( logged === true)
    return <Redirect exact to="/main/settings"/>;
}
const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
        <Route path="/main" component={Tabs} render={backToLogin}/>
          <Route path="/Weather" component={Weather} render={backToLogin}/>
          <Route path="/feed" component={Feed} render={backToLogin}/>
          <Route path="/main" component={Tabs} render={backToLogin}/>
          <Route path="/landing" component={Landing} exact={true} render={skipLogin}/>
          <Route exact path="/" render={() => <Redirect to="/landing" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
)
const { PushNotifications } = Plugins;
const INITIAL_STATE = {
  notifications: [{ id: 'id', title: "Test Push", body: "This is my first push notification" }],
};

export class Home extends React.Component {
  state: any = {};
  props: any = {};
  constructor(props: any) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  push() {
    // Register with Apple / Google to receive push via APNS/FCM
 
    PushNotifications.register();

    // On succcess, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with your setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        let notif = this.state.notifications;
        notif.push({ id: notification.id, title: notification.title, body: notification.body })
        this.setState({
          notifications: notif
        })
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        let notif = this.state.notifications;
        notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
        this.setState({
          notifications: notif
        })
      }
    );
  }
  render() {
    const { notifications } = this.state;
    return (
      <IonPage>
        ...
      </IonPage >
    );
  };
}


export default App;