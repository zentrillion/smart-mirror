import { Component, OnInit, Input, ViewChild } from "@angular/core"


@Component({
    selector: 'app-timer',   
    template: `
   <div>
    {{timer}}
    <button (click)="startStop()">Start/Stop</button>
   </div>
    ` 
})
export class TimerComponent implements OnInit{

    timer : number = 0;
    intervalId : number;
    
    constructor() {
    }

    start() {
      this.intervalId = window.setInterval(() => {
        this.timeIt()
      }, 1000);
    }
    
    stop() {
       clearInterval(this.intervalId);
       this.intervalId = -1;
    }
    
    startStop() {
      if(this.intervalId == -1) {
        this.start();
      }  else {
        this.stop();
      }
    }

    timeIt() {
     this.timer++;
    }
    
    ngOnInit() {
      this.start();
    }
}