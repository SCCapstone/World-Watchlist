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
      isUnsubscribing: false,
      CurrentUser:null,
      isweatherOpen:false,
      isSearching:false,
      isSubscribing:false,
      weeklyData:[]
  };


  constructor(props: WeatherProps) {
    super(props)
    auth.onAuthStateChanged(async () => {
      console.log(this.state.subscription)
      if(auth.currentUser) {
        //gets the username of our user
        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
          if(doc.data()) {
            this.setState({CurrentUser:doc.data()!.username})
          }
          // go into weatherSubscription collection
          const dbSubscription = db.collection('weatherSubscription').doc(auth.currentUser?.uid)
          // Check weather subscription array exist for user
          dbSubscription.get().then((doc) => {
            // use existing array
            if (doc.exists) {
              var subscriptionField = doc.data()
              if (subscriptionField) {
                this.setState({subscription:subscriptionField.subscription})
              }
            }
            // create an array for the user.
              else {
                db.collection("weatherSubscription").doc(auth.currentUser?.uid).set({
                  subscription:[]
            })
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        })
      }
  })

  }
  // ParentComponent = (props:any) => (
  //   <div className="card calculator">
  //     <div id="children-pane">
  //       {props.children}
  //     </div>
  //   </div>
  // );

  // ChildComponent = (props: {weather_code:any, temp:any, location: any, index:any}) =>
  // <IonCard>
  //       <IonCardHeader >
  //         <IonCardSubtitle>{props.location}</IonCardSubtitle>
  //         <IonCardTitle >{props.temp}</IonCardTitle>
  //       </IonCardHeader>
  //       <IonCardContent>
  //       {props.weather_code}
  //       <IonButton id="unsubButton" expand="block" color="dark" type="submit" shape="round" onClick={()=> this.unsubscribe(props.index) && this.setState({isUnsubscribing:true})}>unsub</IonButton>
  //       </IonCardContent>
  //     </IonCard>


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
      console.log(weeklyData)
      const new_location = this.state.name
      const found = this.state.subscription.some(el => el.location === new_location);
      if (found === true) {
        console.log("already subscribed")
      } else {
        console.log("adding to subscription")
        this.state.subscription.push({location:this.state.name,weeklyData:weeklyData,temp:this.state.temp, weather_code:this.state.weather_code})
        /* Add data to firebase firestore */
        db.collection('weatherSubscription').doc(auth.currentUser?.uid).update({
          subscription:this.state.subscription
        })
      }
      console.log(this.state.subscription)
    this.setState({showLoading: false})
  }

  async search(lat: any, long: any) {
    await axios.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={hourly,minutely}&appid=853ea8c8d782be685ad81ace7b65291a&units=imperial")
    .then(async (response) => {
      const dailyWeather = await response.data.daily
      console.log(dailyWeather)
      var dailyData: any[] = []
      for (var i = 1; i < dailyWeather.length; i++) {
        dailyData.push({date:new Date(await dailyWeather[i].dt*1000).toString().substring(0,3), forecast:dailyWeather[i].weather[0].description, temp:dailyWeather[i].feels_like.day, dt:dailyWeather[i].dt})
      }
      // dailyWeather.forEach(async (day: any) => {
      //   dailyData.push({date:new Date(await day.dt*1000).toString(), forecast:day.weather[0].description, temp:day.feels_like.day, dt:day.dt})
      // });
      this.setState({weeklyData:dailyData})
      const currentWeather = response.data.current
      this.setState({temp:currentWeather.temp+'F',weather_code: currentWeather.weather[0].description, location: this.state.name})
      /* Add data to firebase firestore */
    }).catch((error) => {
      console.log(error)
    });
    this.setState({showLoading: false, isSubscribing:true})
  }

  /* get latitude and longitude of location */
  async geocode(location: any) {
    if (location === null) {
      console.log("Please enter a valid location")
    } else {
      await axios.get('https://us1.locationiq.com/v1/search.php?key=pk.180fdf6168d1230db0cc5c937b7eaa98&q&q='+location+'&limit=1&countrycodes=US&namedetails=1&format=json')
    .then((response) => {
      let data = response.data[0]
      console.log(data)
      let lat = data.lat
      let long = data.lon
      let display_name = data.display_name
      this.setState({lat: lat, long: long, name: display_name})
    }).catch(err => {
      console.error(err);
    });
    }
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
      <IonTitle >
          Search Weather
        </IonTitle>
      </IonToolbar>
      </IonHeader>
        <IonContent>
        <IonSearchbar placeholder="State, City, address..." onIonInput={(e: any) => this.setState({req:e.target.value})} animated></IonSearchbar>
        <IonButton id="searchButton" size="default" color="dark" type="submit" expand="full" shape="round" onClick={() => this.geocode(this.state.req)
          && this.setState({showLoading: true })}>
          Search
        </IonButton>
        <IonLoading
        isOpen={this.state.showLoading}
        onDidDismiss={() =>  this.search(this.state.lat, this.state.long)}
        message={'Getting data from API'}
        duration={1000}
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
                <IonButton onClick={() => this.subscribe()} fill='clear'>
                  <IonIcon id='addFriendModalCloseIcon' icon={addCircle}/>
                </IonButton>
        </IonButtons>
      <IonTitle >
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
          <WeatherSubChildren subs={this.state.subscription} func={this.handleUnsub.bind(this)}></WeatherSubChildren>
          </IonItem>
        </IonList>
          </IonContent>
        </IonModal>
      )
    }


}

export default Weather
