import { Component, OnInit, Input, ViewChild } from "@angular/core"


@Component({
    selector: 'app-time',   
   /** template: `<blockquote>{{time.toLocaleString("hi-IN")  | date:'yyyy-MM-dd HH:mm:ss' }}</blockquote>`,*/
    template: ` <blockquote>{{ time | date:'fullDate' }} </blockquote> <blockquote>{{ time | date:'HH:mm:ss'   }}</blockquote>`,
    styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit{

  time : any = Date();
  
  constructor() {
  }

  start() {
    window.setInterval(() => {
      this.timeIt()
    }, 1000);
  }
  
  timeIt() {
   this.time = Date();
  }
  
  ngOnInit() {
    this.start();
  }
}
   