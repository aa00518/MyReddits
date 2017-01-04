import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Usersettings } from '../../providers/usersettings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  category: any;
  limit: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersettings: Usersettings) {
  }

  ngOnInit() {
    this.category = this.usersettings.getCategory();
    this.limit = this.usersettings.getLimit();
  }

  saveSettings() {
    this.usersettings.setUserSettings(this.category, this.limit);
    this.usersettings.setHasChanged();
    this.navCtrl.parent.select(0);
  }
}
