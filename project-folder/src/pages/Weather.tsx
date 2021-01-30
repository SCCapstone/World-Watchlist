import React from 'react';
import axios from 'axios'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonSearchbar,
  IonInput,
  IonButton,
  IonLoading,
  IonRouterOutlet,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,

} from '@ionic/react'
import './Weather.css'
import firebase, {db, auth} from '../firebase'
import { Redirect, Route } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';
import Tabs from './Tabs'

type MyState = {
  lat: any, 
  long: any,
  name: any,
  req: any,
  temp: any,
  weather_code: any,
  showLoading: boolean,
  location: any,
  subscription: any[],
  isUnsubscribing: boolean,
  CurrentUser:any
}

type MyProps = {
  history: any;
  location: any;
}


class Weather extends React.Component<MyProps,MyState> {
  state: MyState = {
      lat: null, 
      long: null,
      name: null,
      req: null,
      temp: null,
      weather_code: null,
      showLoading: false,
      location: null,
      subscription: [],
      isUnsubscribing: false,
      CurrentUser:null
  };

  
  constructor(props: MyProps) {
    super(props)
    
    auth.onAuthStateChanged(async () => {
      console.log(this.state.subscription)
      if(auth.currentUser) {
        //gets the username of our user
        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
          if(doc.data()) {
            console.log('social debug username: ' + doc.data()!.username)
            this.setState({CurrentUser:doc.data()!.username})
          }
          const dbSubscription = db.collection('weatherSubscription').doc(this.state.CurrentUser)
          dbSubscription.get().then((doc) => {
            if (doc.exists) {
              var subscriptionField = doc.data()
              if (subscriptionField) {
                this.setState({subscription:subscriptionField.subscription})
              }
            } else {
              db.collection("weatherSubscription").doc(this.state.CurrentUser).set({
                subscription:[]
            })
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        
        })
      }

      //this.setState({subscription: dbSubscription})
  })
    
  }
  ParentComponent = (props:any) => (
    <div className="card calculator">
      <div id="children-pane">
        {props.children}
      </div>
    </div>
  );

  ChildComponent = (props: {weather_code:any, temp:any, location: any, index:any}) => 
  <IonCard>
        <IonCardHeader >
          <IonButton size="small" color="dark" type="submit" expand="full" shape="round" onClick={()=> this.unsubscribe(props.index) && this.setState({isUnsubscribing:true})}>unsub</IonButton>
          <IonCardSubtitle>{props.location}</IonCardSubtitle>
          <IonCardTitle >{props.temp}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
        {props.weather_code}
        </IonCardContent>
      </IonCard>  

  
  /* remove item from subscribed based on index */
  async unsubscribe(index:any) {
    console.log(index)
    this.state.subscription.splice(index,1)
    db.collection('weatherSubscription').doc(this.state.CurrentUser).update({
      subscription: this.state.subscription
    })
  }

  /* add new current weather location to subscribed array */

  async subscribe(lat: any, long: any) {
    await fetch(
      "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID=853ea8c8d782be685ad81ace7b65291a&units=imperial"
    )
      .then(res => res.json())
      .then(data => {
        /* Pushes new location weather data onto subscription array */
        const new_location = this.state.name
        const found = this.state.subscription.some(el => el.location === new_location);
        console.log(found)
        if (found === true) {
          console.log("already subscribed")
        } else {
          this.state.subscription.push({location: this.state.name, temp:data.main.temp+' F', weather_code: data.weather[0].description})
        }
        this.setState({temp:data.main.temp+'F',weather_code: data.weather[0].description, location: this.state.name})
        /* Add data to firebase firestore */
        db.collection('weatherSubscription').doc(this.state.CurrentUser).update({
          subscription: this.state.subscription
        })
      }).catch(err => {
        console.error(err);
      });
  }

  /* get latitude and longitude of location */
  async geocode(location: any) {
    await axios.get('https://us1.locationiq.com/v1/search.php?key=pk.180fdf6168d1230db0cc5c937b7eaa98&q&q='+location+'&limit=1&countrycodes=US&namedetails=1&format=json')
    .then((response) => {
      let data = response.data[0]
      console.log(data)
      let lat = data.lat
      let long = data.lon
      let display_name = data.display_name
      this.setState({lat: lat, long: long, name: display_name})
    });
  }
  
  /* ClimaCell API (currently not in used because ran out of request) */
  // async getWeatherData(lat: any, long: any) {
  //   await fetch("https://api.climacell.co/v3/weather/forecast/daily?lat="+ lat + "&lon="+ long +"&unit_system=us&start_time=now&fields=feels_like&fields="+
  //   "wind_speed&fields=precipitation_probability&fields=weather_code&fields=humidity&apikey=YSpFrL7B389Ssy8msuqnPT3oY7keeAXf", {
  //     "method": "GET",
  //     "headers": {}
  //   })
  //     .then(response => {
  //       response.json().then((data) => {
  //         var wlist = []
  //         wlist.push({location: this.state.name, temp:data[0].feels_like[0].min.value +' '+data[0].feels_like[0].min.units, weather_code: data[0].weather_code.value})
  //         this.state.subscription.push(wlist)
  //         // console.log(this.state.subscription)
  //         this.setState({temp:data[0].feels_like[0].min.value+data[0].feels_like[0].min.units+' ',weather_code: data[0].weather_code.value, location: this.state.name})
  //         });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // } 

    render() {
      const weatherDisplay = [];
      for (var i = 0; i < this.state.subscription.length; i+=1) {
        weatherDisplay.push(<this.ChildComponent key={i} weather_code={this.state.subscription[i].weather_code} 
          temp={this.state.subscription[i].temp} location={this.state.subscription[i].location} index={i} />);
      };
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Weather
            </IonTitle>
            <IonRouterOutlet>
            <Route path="/main" component={Tabs} exact={true}/>
      </IonRouterOutlet>
        <IonButton href="/main">
            <IonIcon icon={arrowBack} />
        </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonSearchbar value={this.state.req} placeholder="place" onIonInput={(e: any) => this.setState({req:e.target.value})} animated></IonSearchbar>
              <IonButton id="searchButton" size="default" color="dark" type="submit" expand="full" shape="round" onClick={() => this.geocode(this.state.req) 
                && this.setState({showLoading: true })}>
            search
          </IonButton>
          <IonLoading
        isOpen={this.state.showLoading}
        onDidDismiss={() =>  this.subscribe(this.state.lat, this.state.long) && this.setState({showLoading: false})}
        message={'Getting data from API'}
        duration={750}
      />

      <this.ParentComponent>
       {weatherDisplay}
      </this.ParentComponent>

          </IonContent>
      </IonPage>
      )
    }
    

}

export default Weather
