import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Redditsprovider } from '../../providers/redditsprovider';
import { DetailsPage } from '../details/details'

@Component({
  selector: 'page-reddits',
  templateUrl: 'reddits.html'
})
export class RedditsPage {
  
  items: any;
  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private redditsprovider: Redditsprovider) {
    this.getDefaults();
  }

  getDefaults() {
    if (localStorage.getItem('category') != null) {
      this.category = localStorage.getItem('category');
    } else {
      this.category = 'sports';
    }

    if (localStorage.getItem('limit') != null) {
      this.limit = localStorage.getItem('limit');
    } else {
      this.limit = 10;
    }
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad RedditsPage');
  // }

  ngOnInit() {
    this.getPosts(this.category, this.limit);
  }

  getPosts(category, limit) {
    this.redditsprovider.getPosts(category, limit).subscribe(response => {
      this.items = response.data.children;
    });
  }

  viewItem(item) {
    this.navCtrl.push(DetailsPage, {
      item:item
    });
  }

  changeCategory() {
    this.getPosts(this.category, this.limit);
  }
}
