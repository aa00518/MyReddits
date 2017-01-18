import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import azureMobileClient from 'azure-mobile-apps-client';
import {AngularFire, FirebaseListObservable, AuthProviders, FirebaseAuthState } from 'angularfire2';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  angFire: AngularFire;
  user: FirebaseAuthState;
  accounts: FirebaseListObservable<any>;
  items: any;

  constructor(public navCtrl: NavController, af: AngularFire) {
    this.angFire = af;
    af.auth.subscribe(user => {
      if(user) {
        this.user = user;
        this.accounts = af.database.list('/Accounts', {
          query: {
            orderByChild: 'userID',
            equalTo: this.user.auth.uid
          }
      });
      }
      else {
        this.user = null;
        this.accounts = null;
//         af.auth.login({ provider: AuthProviders.Google }).then(a => {
//           this.user = a;
//           this.accounts = af.database.list('/Accounts');
//         }).catch(a => {
//           this.user = {};
//         });
      }
    });
  }

  // http://ionicframework.com/docs/v2/native/google-plus/
  // http://blog.ionic.io/google-oauth-changes/
  // http://vpt-deeplearner.tech/2016/10/17/ionic-2-googleplus-authentication-using-firebase-and-angularfire-on-android-device/

  doLogin() {
    this.angFire.auth.login({ provider: AuthProviders.Google }).then(a => {
      console.log("Starting auth... " + JSON.stringify(a));
      this.user = a;
      this.accounts = this.angFire.database.list('/Accounts', {
        query: {
          orderByChild: 'userID',
          equalTo: this.user.auth.uid
        }
      });
    }).catch(a => {
      console.log("Auth error... " + JSON.stringify(a));
      this.user = null;
      this.accounts = null;
    });
  }

  doLogout() {
    this.angFire.auth.logout().then(reason => {
      this.user = null;
      this.accounts = null;
    }).catch(reason => {
      this.user = null;
      this.accounts = null;
    });
  }

  ionViewWillEnter() {
    this.fetchToDos();
  }

  saveAccount() {
    this.accounts.push({ accountName: 'Big Farter', userID: this.user.auth.uid });
  }

// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-html-how-to-use-client-library
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-how-to-use-client-library
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-get-started-offline-data
// https://github.com/azure/azure-mobile-apps-js-client/blob/master/offline-sync.md
// https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-cordova-get-started-users
// https://github.com/Azure/azure-mobile-apps-js-client - 25 days ago as of 1/6/2017

  fetchToDos() {
    var client = new azureMobileClient.MobileServiceClient("https://cloudclient.azurewebsites.net");
    var todoTable = client.getTable("todoitem");

    todoTable
    .where({ deleted: false, complete: false })  // BUG on android -- only in prod???
    //.where("(deleted eq false) and (complete eq false)")
    .orderBy("text")
    .read().then(results => {
      this.items = results;
    }, error => {
      this.items = null;
    });
  }
}
