import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  news: News;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get<News>('https://newsapi.org/v2/top-headlines?country=AT&apiKey=0e3efd52fbc947c491f4f71c776be1be').subscribe(data => {
      console.log(data.status);
      console.log(data.totalResults);
      this.news = data;
    },
    err => {
      console.log("Error occured.");
    });
  }

}

interface News {
  status: string;
  totalResults: number;
  articles: NewsEntry[];
}

interface NewsEntry {
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

interface Source {
  id: number;
  name: string;
}