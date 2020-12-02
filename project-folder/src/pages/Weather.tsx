import React from 'react';
import openCage from '../API/openCage'
import NodeGeocoder from 'node-geocoder' 
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,

} from '@ionic/react'

import './Weather.css'

type MyState = {

}

type MyProps = {
  history: any;
  location: any;
}



class Weather extends React.Component<MyProps, MyState> {
  state: MyState = {
};
  


  constructor(props: MyProps) {
    super(props)
    var geocoder = NodeGeocoder({
        provider: 'opencage',
        apiKey: 'ade3451aaaa348da989c053dd53eef56'
    });
  }
  
//   async test(location: any) {
//     geocoder.geocode(location, function(err: any, res: any) {  
//         openCageData = res;
//         console.log(openCageData[0])
//       });
//     }

  async getWeatherData(lat: any, long: any) {
    await fetch("https://api.climacell.co/v3/weather/forecast/hourly?lat="+lat+"&lon="+long+"&unit_system=si&start_time=now&fields=weather_code&apikey=YSpFrL7B389Ssy8msuqnPT3oY7keeAXf", {
        "method": "GET",
        "headers": {}
      })
      .then(response => {
        response.json().then(function(data) {
            console.log(data);
          });
      })
      .catch(err => {
        console.error(err);
      });
      
  }

  componentDidMount() {
      this.getWeatherData(33.9204354, -80.3414693)
  }
    render() {
      return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              Weather
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        </IonContent>
      </IonPage>
      )
    }

}

export default Weather
