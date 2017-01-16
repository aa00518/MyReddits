import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class Redditsprovider {
  
  http: any;
  baseUrl: string;

  constructor(http: Http) {
    this.http = http;
    this.baseUrl = 'https://www.reddit.com/r';
  }

  getPosts(category, limit) {
    return this.http.get(this.baseUrl + '/' + category + '/top.json?limit=' + limit).map(res => res.json());
  }
}

/*
Use this portion of the reddit api and ionic infinite scrolling to implement infinite scrolling...
listings
Many endpoints on reddit use the same protocol for controlling pagination and filtering. These endpoints are called Listings and share five common parameters: after / before, limit, count, and show.
Listings do not use page numbers because their content changes so frequently. Instead, they allow you to view slices of the underlying data. Listing JSON responses contain after and before fields which are equivalent to the "next" and "prev" buttons on the site and in combination with count can be used to page through the listing.
The common parameters are as follows:
after / before - only one should be specified. these indicate the fullname of an item in the listing to use as the anchor point of the slice.
limit - the maximum number of items to return in this slice of the listing.
count - the number of items already seen in this listing. on the html site, the builder uses this to determine when to give values for before and after in the response.
show - optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
To page through a listing, start by fetching the first page without specifying values for after and count. The response will contain an after value which you can pass in the next request. It is a good idea, but not required, to send an updated value for count which should be the number of items already fetched.
*/
