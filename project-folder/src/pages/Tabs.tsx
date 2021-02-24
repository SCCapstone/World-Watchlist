import React from 'react';
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonRouterOutlet
} from '@ionic/react'
import { Redirect, Route } from 'react-router-dom';
import { newspaperOutline, peopleOutline, settingsOutline} from 'ionicons/icons';
import Feed from './Feed'
import Social from './Social'
import Settings from './Settings'
import './Tabs.css'

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/main" exact render={() => <Redirect to="/main/feed"/>} />
        <Route path="/main/feed" component={Feed} exact={true} />
        <Route path="/main/social" component={Social} exact={true} />
        <Route path="/main/settings" component={Settings} exact={true}/>
      </IonRouterOutlet>
      <IonTabBar color='dark'class='tabToolbar' slot="bottom">
          <IonTabButton class='tabIcon' tab="feed" href="/main/feed">
            <IonIcon icon={newspaperOutline} />
            <IonLabel>Feed</IonLabel>
          </IonTabButton>
          <IonTabButton class='tabIcon' tab="social" href="/main/social">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Social</IonLabel>
          </IonTabButton>
          <IonTabButton class='tabIcon' tab="settings" href="/main/settings">
            <IonIcon icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  )
}

export default Tabs
