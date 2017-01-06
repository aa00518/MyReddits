import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import azureMobileClient from 'azure-mobile-apps-client';

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

  fetchToDos() {
    var client = new azureMobileClient.MobileServiceClient('https://cloudclient.azurewebsites.net');
    var todoTable = client.getTable('todoitem');

    todoTable
      .where({ deleted: false, complete: false })
      .orderBy('text')
      .read().then(results => {
      this.items = results;
    }, error => {
      this.items = null;
    });

    // function success(results) {
    //   this.items =  results;
    //   // var numItemsRead = results.length;
    //   // for (var i = 0; i < results.length; i++) {
    //   //   var row = results[i];
    //   // }
    // }

    // function failure(error) {
    //   this.items = null;
    // }
  }
}
