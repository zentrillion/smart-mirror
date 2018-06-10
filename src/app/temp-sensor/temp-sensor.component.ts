'use strict';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-temp-sensor',
  templateUrl: './temp-sensor.component.html',
  styleUrls: ['./temp-sensor.component.scss']
})
export class TempSensorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //TODO: implement Azure message receiver for temp sensor
  }

}
