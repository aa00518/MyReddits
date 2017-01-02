import { Component } from '@angular/core';

import { RedditsPage } from '../reddits/reddits';
import { SettingsPage } from '../settings/settings';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = RedditsPage;
  tab2Root: any = SettingsPage;
  tab3Root: any = AboutPage;

  constructor() {

  }
}
