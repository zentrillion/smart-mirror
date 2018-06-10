import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class QuotationsComponent implements OnInit {

  quotation: Quotation;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get<Quotation>('https://taeglicheszit.at//zitat-api.php?format=json').subscribe(data => {
      console.log(data.autor);
      console.log(data.zitat);
      this.quotation = data;
    },
    err => {
      console.log("Error occured.");
    });
  }

}

interface Quotation {
  autor: string;
  zitat: string;
  kommentar: string;
}