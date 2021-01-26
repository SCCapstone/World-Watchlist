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

} from '@ionic/react'

import './Weather.css'
import { Redirect, Route } from 'react-router';
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
    showLocation: any
}

type MyProps = {
  
}

class Weather extends React.Component<MyProps, MyState> {
  state: MyState = {
      lat: null, 
      long: null,
      name: null,
      req: null,
      temp: null,
      weather_code: null,
      showLoading: false,
      showLocation: null
  };
  
  constructor(props: MyProps) {
    super(props);
  }

  async geocode(location: any) {
    await axios.get('https://us1.locationiq.com/v1/search.php?key=pk.180fdf6168d1230db0cc5c937b7eaa98&q&q='+location+'&limit=1&countrycodes=US&namedetails=1&format=json')
    .then((response) => {
      let data = response.data[0]
      console.log(data)
      let lat = data.lat
      let long = data.lon
      let display_name = data.display_name
      console.log(display_name)
      this.setState({lat: lat, long: long, name: display_name})
    });
  }
  
  async getWeatherData(lat: any, long: any) {
    await fetch("https://api.climacell.co/v3/weather/forecast/daily?lat="+ lat + "&lon="+ long +"&unit_system=us&start_time=now&fields=feels_like&fields=wind_speed&fields=precipitation_probability&fields=weather_code&fields=humidity&apikey=YSpFrL7B389Ssy8msuqnPT3oY7keeAXf", {
      "method": "GET",
      "headers": {}
    })
      .then(response => {
        response.json().then((data) => {
            console.log(data[1])
            this.setState({temp:data[0].feels_like[0].min.value+' '+data[0].feels_like[0].min.units})
            this.setState({weather_code: data[0].weather_code.value})
            //console.log(data.weather_code.value);
          });
      })
      .catch(err => {
        console.error(err);
      });
  } 
    render() {
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Weather
            </IonTitle>
            <IonRouterOutlet>
            <Route path="/main" component={Tabs}/>
      </IonRouterOutlet>
        <IonButton href="/main">
            <IonIcon icon={arrowBack} />
        </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonSearchbar value={this.state.req} placeholder="place" onIonInput={(e: any) => this.setState({req:e.target.value})} animated></IonSearchbar>
              {/* onclick show loading and on dismiss show news. */}
              <IonButton id="searchButton" size="default" color="dark" type="submit" expand="full" shape="round" onClick={() => this.geocode(this.state.req) && this.setState({showLoading: true, weather_code: null, temp: null})}>
            search
          </IonButton>
          <IonLoading
        isOpen={this.state.showLoading}
        onDidDismiss={() => this.getWeatherData(this.state.lat, this.state.long) && this.setState({showLoading: false, showLocation: this.state.name})}
        message={'Getting data from API'}
        duration={350}
      />

          <h3 id="content">
            place: {this.state.showLocation}
            <p>
            weather: {this.state.weather_code}
            </p>
            temp: {this.state.temp}
          </h3>

          </IonContent>
      </IonPage>
      )
    }
}

export default Weather
