import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import azureMobileClient from 'azure-mobile-apps-client';
import { AngularFire, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { GooglePlus } from 'ionic-native';
import firebase from 'firebase';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  userProfile: FirebaseAuthState = null;
  accounts: FirebaseListObservable<any>;
  items: any;

  constructor(public navCtrl: NavController, public af: AngularFire, public alertController: AlertController, public platform: Platform) {
  }

  googlePlusLogin() {
    GooglePlus.login({'webClientId' : '658095225206-i1amh87tv7mfjunlk4ifqb3ne2dc2mhr.apps.googleusercontent.com' }).then((userData) => {
      var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
      firebase.auth().signInWithCredential(provider).then((success) => {
        //console.log(JSON.stringify(success));
        this.userProfile = success;
        this.fetchMyAccounts();
      })
      .catch((error) => {
        this.displayAlert(JSON.stringify(error), "Firebase login failed.");
      });
    })
    .catch((error) => {
      this.displayAlert(JSON.stringify(error), "GooglePlus login failed.");
    });
  }

  displayAlert(value, title)
  {
    let coolAlert = this.alertController.create({
      title: title,
      message: JSON.stringify(value),
      buttons: [{
                  text: "Cancel"
                },
                {
                  text: "Save",
                  handler: data => {
                  }
                }]
      });
    coolAlert.present();
  }

  fetchMyAccounts() {
    this.accounts = this.af.database.list('/Accounts', {
      query: {
        orderByChild: 'userID',
        equalTo: this.userProfile.uid
      }
    });
  }

  // http://vpt-deeplearner.tech/2016/10/17/ionic-2-googleplus-authentication-using-firebase-and-angularfire-on-android-device/

  // Firebase items
  // uid
  // displayName
  // photoURL
  // email

  // Google Plus items
  // obj = res;
  // obj.email          // 'eddyverbruggen@gmail.com'
  // obj.userId         // user id
  // obj.displayName    // 'Eddy Verbruggen'
  // obj.familyName     // 'Verbruggen'
  // obj.givenName      // 'Eddy'
  // obj.imageUrl       // 'http://link-to-my-profilepic.google.com'
  // obj.idToken        // idToken that can be exchanged to verify user identity.
  // obj.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access

  // doSilentLogin() {
  //   if (this.plt.is('android')) {
  //     GooglePlus.trySilentLogin({}).then((res) => {
  //       console.log('Android silent login good.');
  //       this.user = res;
  //       this.userID = res.userId;
  //       this.userDisplayName = res.displayName;
  //       this.accounts = this.af.database.list('/Accounts', {
  //         query: {
  //           orderByChild: 'userID',
  //           equalTo: this.userID
  //         }
  //       });
  //     },
  //     (err) => {
  //       console.log('Android silent login error...');
  //       console.log(err);
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     });
  //   }
  //   else {
  //     this.af.auth.subscribe(user => {
  //       if(user) {
  //         this.user = user;
  //         this.userID = user.auth.uid;
  //         this.userDisplayName = user.auth.displayName;
  //         this.accounts = this.af.database.list('/Accounts', {
  //           query: {
  //             orderByChild: 'userID',
  //             equalTo: this.userID
  //           }
  //         });
  //       }
  //       else {
  //         this.user = null;
  //         this.accounts = null;
  //         this.userID = null;
  //         this.userDisplayName = null;
  //       }
  //     });
  //   }
  // }

  // doLogin() {
  //   if (this.plt.is('android')) {
  //     GooglePlus.login({}).then((res) => {
  //       console.log('Android login good.');
  //       this.user = res;
  //       this.userID = res.userId;
  //       this.userDisplayName = res.displayName;
  //       this.accounts = this.af.database.list('/Accounts', {
  //         query: {
  //           orderByChild: 'userID',
  //           equalTo: this.userID
  //         }
  //       });
  //     },
  //     (err) => {
  //       console.log('Android login error...');
  //       console.log(err);
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     });
  //   }
  //   else {
  //     this.af.auth.login({ provider: AuthProviders.Google }).then(a => {
  //       console.log("Starting auth... " + JSON.stringify(a));
  //       this.user = a;
  //       this.userID = a.auth.uid;
  //       this.userDisplayName = a.auth.displayName;
  //       this.accounts = this.af.database.list('/Accounts', {
  //         query: {
  //           orderByChild: 'userID',
  //           equalTo: this.userID
  //         }
  //       });
  //     }).catch(a => {
  //       console.log("Auth error... " + JSON.stringify(a));
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     });
  //   }
  // }

  // doLogout() {
  //   if (this.plt.is('android')) {
  //     GooglePlus.logout().then(() => {
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     });
  //   }
  //   else {
  //     this.af.auth.logout().then(reason => {
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     }).catch(reason => {
  //       this.user = null;
  //       this.accounts = null;
  //       this.userID = null;
  //       this.userDisplayName = null;
  //     });
  //   }
  // }

  ionViewWillEnter() {
    //this.doSilentLogin();
    this.fetchToDos();
  }

  saveAccount() {
    this.accounts.push({ accountName: 'Randal', userID: this.userProfile.uid });
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
