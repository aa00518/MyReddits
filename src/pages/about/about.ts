import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//declare var WindowsAzure: any;
//import '../../../plugins/cordova-plugin-ms-azure-mobile-apps/www/MobileServices.Cordova.js'
import WindowsAzure from 'azure-mobile-apps-client';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  items: any;

  constructor(public navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.fetchToDos();
  }

// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-html-how-to-use-client-library
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-how-to-use-client-library
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-get-started-offline-data
// https://github.com/azure/azure-mobile-apps-js-client/blob/master/offline-sync.md
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-get-started-users
// https://github.com/Azure/azure-mobile-apps-js-client - 25 days ago as of 1/6/2017

  fetchToDos() {
    var client = WindowsAzure.MobileServiceClient("https://cloudclient.azurewebsites.net");
    var todoTable = client.getTable("todoitem");

    todoTable
    .where({ deleted: false, complete: false })  // BUG on android!!
    .orderBy("text")
    .read().then(results => {
      this.items = results;
    }, error => {
      this.items = null;
    });
  }
}
