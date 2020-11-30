import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
<<<<<<< HEAD
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Subscription from './pages/Subscription';

=======
import Landing from './pages/Landing'
import Tabs from './pages/Tabs'
>>>>>>> f60420dbce4869e59238dc2005c81721df5dd23d
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

const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
<<<<<<< HEAD
          <Route path="/tab1" component={Tab1} exact={true} />
          <Route path="/tab2" component={Tab2} exact={true} />
          <Route path="/tab3" component={Tab3} />
          <Route path="/Subscription" component={Subscription} exact={true} />
          <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
=======
          <Route path="/main" component={Tabs}/>
          <Route path="/landing" component={Landing} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/landing" />} />
>>>>>>> f60420dbce4869e59238dc2005c81721df5dd23d
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
)


export default App;
