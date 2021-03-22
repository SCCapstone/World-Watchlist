import React from 'react';
import ParentComponent from './SubscriptionParent';
import WeatherSubChild from './WeatherSubChild';

function WeatherSubChildren(props: {subs: Array<any>, func: any}) {
    let subs = props.subs.map((item, index) => {return <WeatherSubChild 
        key={item.location} 
        weeklyForecast={item.weeklyForecast}
        weather_code={item.weather_code}
        temp={item.temperature} location={item.location}
        index={index} func={props.func}></WeatherSubChild>})
    return <ParentComponent>{subs}</ParentComponent>;
} 
export default WeatherSubChildren;