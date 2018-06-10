import {
  CurrentWeather,
  Forecast
} from 'angular-weather-widget/services/api/weather.api.service';
import { Component } from '@angular/core';
import { TemperatureScale } from 'angular-weather-widget/components/weather-current-temperature/current-temperature.component';
import {
  ForecastMode,
  WeatherLayout,
  WeatherSettings
} from 'angular-weather-widget/weather.interfaces';

@Component({
  selector: 'app-weather-widget',
  template: '<weather-widget [settings]="settings"></weather-widget>'
})
export class WeatherWidgetComponent {
  settings: WeatherSettings = {
    location: {
      cityName: 'Linz'
    },
    scale: TemperatureScale.CELCIUS,
    backgroundColor: '#000000',
    color: '#ffffff',
    width: '200px',
    height: '300px',
    showWind: true,
    showDetails: true,
    showForecast: false,
    forecastMode: ForecastMode.GRID,
    language: 'de',
    layout: WeatherLayout.NARROW
  };

  onUpdate() {
    this.settings = Object.assign({}, this.settings);
  }
}
