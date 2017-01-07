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
// https://github.com/Azure/azure-mobile-apps-js-client - 25 days ago as of 1/6/2017

  fetchToDos() {
    //console.log("Inside fetchToDos.");

    var client = new azureMobileClient.MobileServiceClient("https://cloudclient.azurewebsites.net");
    //console.log("step 1");
    var todoTable = client.getTable("todoitem");
    //console.log("step 2");

    todoTable
    //.where({ deleted: false, complete: false })  // BUG on android!!
    //.orderBy("text")                             // BUG on android!!
    .read().then(results => {
      //console.log("step 3");
      this.items = results;
    }, error => {
      //console.log("step 4");
      this.items = null;
      //console.log(error);
    });

    // var returnvalue = [];

    // function success(results) {
    //   console.log("step 3");
    //    for (var i = 0; i < results.length; i++) {
    //      returnvalue.push(results[i]);
    //    }
    // }
    
    // function failure(error) {
    //   console.log("step 4");
    //   console.log(error);
    // }

    // this.items = returnvalue;

    // todoTable
    //   //.where({ deleted: false, complete: false })  // BUG!!
    //   //.orderBy("text")                             // BUG!!
    //   .read().then(success, failure);
  }
}
