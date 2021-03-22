export interface weatherData {
  date: string;
  forecast:any;
  temp:any;
  dt:any
}

export type WeatherState = {
    lat: any,
    long: any,
    name: any,
    req: any,
    temp: any,
    weather_code: any,
    showLoading: boolean,
    location: any,
    subscription: any[],
    subscriptionData:any[],
    isUnsubscribing: boolean,
    CurrentUser:any,
    isweatherOpen:boolean;
    isSearching:boolean,
    isSubscribing:boolean,
    weeklyData:weatherData[] 
  }


  
export type WeatherProps = {
    isOpen:boolean;
    toggleWeatherModal: any;
}
  