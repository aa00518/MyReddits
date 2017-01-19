import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import azureMobileClient from 'azure-mobile-apps-client';
import { AngularFire, FirebaseListObservable, AuthProviders, FirebaseAuthState } from 'angularfire2';
import { GooglePlus } from 'ionic-native';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  //user: FirebaseAuthState;
  user: any;
  userID: any;
  userDisplayName: any;
  accounts: FirebaseListObservable<any>;
  items: any;

  constructor(public navCtrl: NavController, public af: AngularFire, public plt: Platform) {
  }

  // http://ionicframework.com/docs/v2/native/google-plus/
  // http://blog.ionic.io/google-oauth-changes/
  // http://vpt-deeplearner.tech/2016/10/17/ionic-2-googleplus-authentication-using-firebase-and-angularfire-on-android-device/

  // Need to update both ts and html file
  // GooglePlus.login({}).then((res) => {....});
  // obj = res;
  // obj.email          // 'eddyverbruggen@gmail.com'
  // obj.userId         // user id
  // obj.displayName    // 'Eddy Verbruggen'
  // obj.familyName     // 'Verbruggen'
  // obj.givenName      // 'Eddy'
  // obj.imageUrl       // 'http://link-to-my-profilepic.google.com'
  // obj.idToken        // idToken that can be exchanged to verify user identity.
  // obj.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access

  doSilentLogin() {
    if (this.plt.is('android')) {
      GooglePlus.trySilentLogin({}).then((res) => {
        console.log('Android silent login good.');
        this.user = res;
        this.userID = res.userId;
        this.userDisplayName = res.displayName;
        this.accounts = this.af.database.list('/Accounts', {
          query: {
            orderByChild: 'userID',
            equalTo: this.userID
          }
        });
      },
      (err) => {
        console.log('Android silent login error...');
        console.log(err);
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      });
    }
    else {
      this.af.auth.subscribe(user => {
        if(user) {
          this.user = user;
          this.userID = user.auth.uid;
          this.userDisplayName = user.auth.displayName;
          this.accounts = this.af.database.list('/Accounts', {
            query: {
              orderByChild: 'userID',
              equalTo: this.userID
            }
          });
        }
        else {
          this.user = null;
          this.accounts = null;
          this.userID = null;
          this.userDisplayName = null;
        }
      });
    }
  }

  doLogin() {
    if (this.plt.is('android')) {
      GooglePlus.login({}).then((res) => {
        console.log('Android login good.');
        this.user = res;
        this.userID = res.userId;
        this.userDisplayName = res.displayName;
        this.accounts = this.af.database.list('/Accounts', {
          query: {
            orderByChild: 'userID',
            equalTo: this.userID
          }
        });
      },
      (err) => {
        console.log('Android login error...');
        console.log(err);
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      });
    }
    else {
      this.af.auth.login({ provider: AuthProviders.Google }).then(a => {
        console.log("Starting auth... " + JSON.stringify(a));
        this.user = a;
        this.userID = a.auth.uid;
        this.userDisplayName = a.auth.displayName;
        this.accounts = this.af.database.list('/Accounts', {
          query: {
            orderByChild: 'userID',
            equalTo: this.userID
          }
        });
      }).catch(a => {
        console.log("Auth error... " + JSON.stringify(a));
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      });
    }
  }

  doLogout() {
    if (this.plt.is('android')) {
      GooglePlus.logout().then(() => {
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      });
    }
    else {
      this.af.auth.logout().then(reason => {
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      }).catch(reason => {
        this.user = null;
        this.accounts = null;
        this.userID = null;
        this.userDisplayName = null;
      });
    }
  }

  ionViewWillEnter() {
    this.doSilentLogin();
    this.fetchToDos();
  }

  saveAccount() {
    this.accounts.push({ accountName: 'Big Farter', userID: this.userID });
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
