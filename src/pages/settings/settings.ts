import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    
    this.navCtrl.parent.select(0).getPosts(this.category, this.limit);
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SettingsPage');
  // }
}
