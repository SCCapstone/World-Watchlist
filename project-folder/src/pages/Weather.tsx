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
  IonModal,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonListHeader,

} from '@ionic/react'
import './Weather.css'
import firebase, {db, auth} from '../firebase'
import { addCircle, arrowBack, closeCircleOutline, search } from 'ionicons/icons';
import { WeatherProps, WeatherState, weatherData } from '../components/WeatherTypes';
import WeatherSubChildren from '../components/WeatherSubChildren';
import { NewsDB } from '../config/config';

class Weather extends React.Component<WeatherProps,WeatherState> {
  state: WeatherState = {
      lat: null,
      long: null,
      name: null,
      req: null,
      temp: null,
      weather_code: null,
      showLoading: false,
      location: null,
      subscription: [],
      subscriptionData:[],
      isUnsubscribing: false,
      CurrentUser:null,
      isweatherOpen:false,
      isSearching:false,
      isSubscribing:false,
      weeklyData:[]
  };


  constructor(props: WeatherProps) {
    super(props)
    let temp:any[] = []
    auth.onAuthStateChanged(async () => {
      if(auth.currentUser) {
        //gets the username of our user
          // go into weatherSubscription collection
          const dbSubscription = db.collection('weatherSubscription').doc(auth.currentUser?.uid)
          // Check weather subscription array exist for user
          dbSubscription.onSnapshot(async (doc) => {
            temp = []
            if (doc.exists) {
              var subscriptionField = doc.data()
              if (subscriptionField) {
            this.setState({subscription:subscriptionField.subscription})

                // listen for changes
          subscriptionField.subscription.forEach(async (location: any)=>{
          const query = NewsDB.collection('weather').where("location","==",location)
          const snapshot = await query.get();
          snapshot.forEach(doc => {
            temp.push(doc.data());
          });
          this.setState({subscriptionData:temp})
          query.onSnapshot(async (querySnapshot ) => {
            querySnapshot.docChanges().forEach(change => {
               if (change.type === 'modified') {
                let modifiedLocation = change.doc.data().location
                temp = temp.filter(e => e.location !== modifiedLocation)
                console.log(temp)
                temp.push(change.doc.data());
                this.setState({subscriptionData:temp})
              }
            })
          })
        })
        }
            }
            // create an array for the user if empty
              else {
                db.collection("weatherSubscription").doc(auth.currentUser?.uid).set({
                  subscription:[]
            })
          }
        })
        console.log(this.state.subscription)
    }
    this.setState({subscriptionData:temp})
    })
  }


  /* remove item from subscribed based on index */
  async unsubscribe(index:any) {
    console.log(index)
    this.state.subscription.splice(index,1)
    db.collection('weatherSubscription').doc(auth.currentUser?.uid).update({
      subscription: this.state.subscription
    })
  }

  /* add new current weather location to subscribed array */
  async subscribe() {
      const weeklyData = this.state.weeklyData
      const new_location = this.state.name
      const found = this.state.subscription.some(el => el === new_location);
      if (found === true) {
        console.log("already subscribed")
      } else {
        console.log("adding to subscription")
        /* Add data to firebase firestore */
        db.collection('weatherSubscription').doc(auth.currentUser?.uid).update({
          subscription:firebase.firestore.FieldValue.arrayUnion(this.state.name)
        })
      }
    console.log(this.state.subscription)
    this.setState({isSubscribing:false, isSearching:false,showLoading: false})
    return 0
  }

  async search(lat: any, long: any) {
    await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={hourly,minutely}&appid=853ea8c8d782be685ad81ace7b65291a&units=imperial")
    .then(async (response) => {
      const dailyWeather = await response.data.daily
      var dailyData: any[] = []
      for (var i = 1; i < dailyWeather.length; i++) {
        dailyData.push({date:new Date(await dailyWeather[i].dt*1000).toString().substring(0,3), forecast:dailyWeather[i].weather[0].description, temp:dailyWeather[i].feels_like.day, dt:dailyWeather[i].dt})
      }
      this.setState({weeklyData:dailyData})
      const currentWeather = response.data.current
      this.setState({temp:currentWeather.temp+'F',weather_code: currentWeather.weather[0].description, location: this.state.name})
      await NewsDB.collection('weather').doc(this.state.name).set({location:this.state.name, lat:this.state.lat, long: this.state.long ,temperature:currentWeather.temp+'F',weather_code: currentWeather.weather[0].description, weeklyForecast:this.state.weeklyData})
      /* Add data to firebase firestore */
    }).catch((error) => {
      console.log(error)
    });
    this.setState({showLoading: false, isSubscribing:true})
  }

  /* get latitude and longitude of location */
  async geocode(location: any) {
    this.setState({showLoading: true })
    if (location === null) {
      console.log("Please enter a valid location")
    } else {
      await axios.get('https://us1.locationiq.com/v1/search.php?key=pk.180fdf6168d1230db0cc5c937b7eaa98&q&q='+location+'&limit=1&countrycodes=US&namedetails=1&format=json')
    .then(async (response) => {
      let data = await response.data[0]
      console.log(data)
      let lat = data.lat
      let long = data.lon
      let display_name = data.display_name
      this.setState({lat: lat, long: long, name: display_name})
    }).catch(err => {
      console.error(err);
    });
    }
    this.search(this.state.lat, this.state.long)
  }

  handleUnsub(index: number) {
    this.unsubscribe(index);
    this.setState({isUnsubscribing:true})
  }


    render() {
      let daily = this.state.weeklyData.map(day => (
        <IonItem key={day.dt}>
          <IonLabel>
            <h1>{day.date}</h1>
            <h2>{day.temp} F</h2>
            <p>Expecting {day.forecast}.</p>
          </IonLabel>
        </IonItem>
      ))
      return (
      <IonModal isOpen={this.props.isOpen} onDidDismiss={this.props.toggleWeatherModal}>
        <IonHeader>
          <IonToolbar className='weatherToolbar'>
            <IonTitle className='weatherTitle'>
              Weather
            </IonTitle>
            <IonButtons slot='start'>
                <IonButton onClick={this.props.toggleWeatherModal} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton id="feedButton" onClick={ ()=> this.setState({isSearching:true})}  fill='clear'>
                  <IonIcon icon={search} />
              </IonButton>
              </IonButtons>
          </IonToolbar>
        </IonHeader>
          <IonModal isOpen={this.state.isSearching}>
          <IonHeader>
      <IonToolbar className="weatherToolbar">
      <IonButtons slot='start'>
                <IonButton onClick={() => this.setState({isSearching: false})} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
      <IonTitle className="weatherTitle">
          Search Weather
        </IonTitle>
      </IonToolbar>
      </IonHeader>
        <IonContent>
        <IonSearchbar placeholder="State, City, address..." onIonInput={(e: any) => this.setState({req:e.target.value})} animated></IonSearchbar>
        <IonButton id="searchButton" size="default" color="dark" type="submit" expand="full" shape="round" onClick={() => this.geocode(this.state.req)}>
          Search
        </IonButton>
        <IonLoading
        isOpen={this.state.showLoading}
        
        message={'Getting data from API'}
        duration={10000}
        />
          </IonContent>
          </IonModal>
          <IonModal isOpen={this.state.isSubscribing}>
          <IonHeader>
      <IonToolbar className="weatherToolbar">
      <IonButtons slot='start'>
                <IonButton onClick={() => this.setState({isSubscribing: false})} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={closeCircleOutline}/>
                </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
                <IonButton onClick={async () => await this.subscribe()} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={addCircle}/>
                </IonButton>
        </IonButtons>
      <IonTitle className="weatherTitle2">
          Subscribe Weather
        </IonTitle>
      </IonToolbar>
      </IonHeader>
          <IonContent>
          <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{this.state.location}</IonCardSubtitle>
            <IonCardTitle>{this.state.temp}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {this.state.weather_code}
            <IonList>
          <IonListHeader>
            <IonLabel>Weekly Forecast</IonLabel>
          </IonListHeader>
          {daily}
        </IonList>
      </IonCardContent>
        </IonCard>
          </IonContent>
          </IonModal>
          <IonContent>
          <IonList>
          <IonListHeader>
            <IonLabel>Subscriptions</IonLabel>
          </IonListHeader>
          <IonItem>
          <WeatherSubChildren subs={this.state.subscriptionData} func={this.handleUnsub.bind(this)}></WeatherSubChildren>
          </IonItem>
        </IonList>
          </IonContent>
        </IonModal>
      )
    }


}

export default Weather
