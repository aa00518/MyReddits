import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
//import 'rxjs/add/operator/map';

@Injectable()
export class Redditsprovider {
  
  http: any;
  baseUrl: string;

  constructor(http: Http) {
    //console.log('Hello Redditsprovider Provider');
    this.http = http;
    this.baseUrl = 'https://www.reddit.com/r';
  }

  getPosts(category, limit) {
    return this.http.get(this.baseUrl + '/' + category + '/top.json?limit=' + limit).map(res => res.json());
  }
}
