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
import { bookmark, bookmarkOutline, newspaperOutline, peopleOutline, settingsOutline} from 'ionicons/icons';
import Feed from '../pages/Feed'
import Social from '../pages/Social'
import Settings from '../pages/Settings'
import Bookmark from '../pages/Bookmark'
import './Tabs.css'

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/main" exact render={() => <Redirect to="/main/feed"/>} />
        <Route path="/main/feed" component={Feed} exact={true} />
        <Route path="/main/social" component={Social} exact={true} />
        <Route path="/main/settings" component={Settings} exact={true}/>
        <Route path="/main/bookmark" component={Bookmark} exact={true}/>
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
          <IonTabButton class='tabIcon' tab="bookmark" href="/main/bookmark">
            <IonIcon icon={bookmarkOutline} />
            <IonLabel>Bookmark</IonLabel>
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
