
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
    isUnsubscribing: boolean,
    CurrentUser:any,
    isweatherOpen:boolean;
  
  }
  
export type WeatherProps = {
    isOpen:boolean;
    toggleWeatherModal: any;
}
  