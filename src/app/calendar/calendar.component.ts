import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendar: Calendar;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get<Calendar>('https://taeglicheszit.at//zitat-api.php?format=json').subscribe(data => {
      this.calendar = data;
    },
    err => {
      console.log("Error occured.");
    });
  }

}

interface Calendar {
  kind: "calendar#events",
  etag: any,
  summary: string,
  description: string,
  updated: any,
  timeZone: string,
  accessRole: string,
  defaultReminders: [
    {
      method: string,
      minutes: number
    }
  ],
  nextPageToken: string,
  nextSyncToken: string
}