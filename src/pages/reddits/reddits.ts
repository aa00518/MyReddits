import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Redditsprovider } from '../../providers/redditsprovider';
import { Usersettings } from '../../providers/usersettings';
import { DetailsPage } from '../details/details'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-reddits',
  templateUrl: 'reddits.html'
})
export class RedditsPage {
  
  items: any;
  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private redditsprovider: Redditsprovider, private loadingCtrl: LoadingController, private usersettings: Usersettings) {
  }

  ionViewWillEnter() {
    if (this.category == null || this.usersettings.getHasChanged())
    {
      this.category = this.usersettings.getCategory();
      this.limit = this.usersettings.getLimit();
      this.getPosts(this.category, this.limit);
      this.usersettings.resetHasChanged();
    }
  }

  getPosts(category, limit) {
    let loader = this.loadingCtrl.create({
      content: "Loading..."
    });
    loader.present();

    this.redditsprovider.getPosts(category, limit).subscribe(response => {
      this.items = response.data.children;
    });

    loader.dismiss();
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
