import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Redditsprovider } from '../../providers/redditsprovider';
import { RedditsPage } from '../reddits/reddits';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private redditsprovider: Redditsprovider) {
    this.getDefaults();
  }

  // ngOnInit() {
  // }

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

  setDefaults() {
    localStorage.setItem('category', this.category);
    localStorage.setItem('limit', this.limit);
    
    //this.navCtrl.push(RedditsPage);
    this.navCtrl.parent.select(0).fireWillEnter();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SettingsPage');
  // }
}
