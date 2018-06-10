import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { QuotationsComponent } from './quotations/quotations.component';

import { HttpClientModule } from '@angular/common/http';
import { NewsComponent } from './news/news.component';
import { WeatherComponent } from './weather/weather.component';
import { TempSensorComponent } from './temp-sensor/temp-sensor.component';

import { Component, NgModule } from '@angular/core';
import { AngularWeatherWidgetModule, WeatherApiName } from 'angular-weather-widget';

import { WeatherWidgetComponent } from './weather-widget/weather-widget.component';
import { FormsModule } from '@angular/forms';

import { TimeComponent } from './time/time.component';
import { TimerComponent } from './timer/timer.component';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import lcoaleDeAt from '@angular/common/locales/de-at';

registerLocaleData(lcoaleDeAt);

@NgModule({
  declarations: [
    AppComponent,
    QuotationsComponent,
    NewsComponent,
    WeatherComponent,
    TempSensorComponent,
    WeatherWidgetComponent,
    TimeComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularWeatherWidgetModule.forRoot({
      key: 'b803f9323ae2c1f50e47dab83961ab94',
      name: WeatherApiName.OPEN_WEATHER_MAP,
      baseUrl: 'http://api.openweathermap.org/data/2.5'
    }),
  HttpClientModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: "de-at" } ],
  bootstrap: [AppComponent]
})
export class AppModule { }



