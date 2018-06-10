import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})

export class WeatherComponent implements OnInit {

  weather: Weather;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get<Weather>('http://api.openweathermap.org/data/2.5/forecast?q=Linz,at&units=metric&appid=b803f9323ae2c1f50e47dab83961ab94').subscribe(data => {
      console.log(data.list[0].main.temp)
      this.weather = data;
    },
    err => {
      console.log("Error occured.");
      console.log(err);
    });
  }

}

interface Weather{
  cod: number;
  message: number;
  cnt: number;
  list: List[];
  city: City;
}

interface List{
  dt: number;
  main: Main;
  weathertest: WeatherData[];
  clouds: Clouds;
  wind: Wind;
  sys: Sys;
}

interface Main{
  temp: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  tmp_kf: number;
}

interface WeatherData{
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Wind{
  speed: number;
  deg: number;
}

interface Clouds{
  all: number;
}

interface Sys{
  pod: string;
}

interface City{
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
}

interface Coord{
  lon: number;
  lat: number;
}