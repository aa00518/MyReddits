import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import azureMobileClient from 'azure-mobile-apps-client';
import { AngularFire, FirebaseListObservable, FirebaseAuthState, AuthProviders } from 'angularfire2';
import { GooglePlus } from 'ionic-native';
import firebase from 'firebase';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('txtActivity') txtActivity;
  @ViewChild('txtAmount') txtAmount;
  userProfile: FirebaseAuthState = null;
  accounts: FirebaseListObservable<any>;
  items: any;
  activity: string;
  amount: number;

  constructor(public navCtrl: NavController, public af: AngularFire, public alertController: AlertController, public platform: Platform, public toastCtrl: ToastController) {
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  googlePlusLogin() {
    GooglePlus.login({ 'webClientId' : '658095225206-i1amh87tv7mfjunlk4ifqb3ne2dc2mhr.apps.googleusercontent.com' }).then((userData) => {
      var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
      firebase.auth().signInWithCredential(provider).then((success) => {
        this.userProfile = success;
        this.fetchMyAccounts();
      }).catch((error) => {
        //this.displayAlert(JSON.stringify(error), "Firebase login failed.");
      });
    }).catch((error) => {
      //this.displayAlert(JSON.stringify(error), "Google Plus login failed.");
    });
  }

  fireBaseLogin() {
    this.af.auth.login({ provider: AuthProviders.Google }).then(a => {
      this.userProfile = a.auth as any;
      this.fetchMyAccounts();
    }).catch(error => {
      //this.displayAlert(JSON.stringify(error), "Firebase login failed.");
    });
  }

  displayAlert(value, title) {
    let coolAlert = this.alertController.create({
      title: title,
      message: value,
      buttons: [//{
                //  text: "Cancel"
                //},
                {
                  text: "Ok",
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

  // uid
  // displayName
  // photoURL
  // email

  doSilentLogin() {
    // if (this.platform.is('android')) {
    //   GooglePlus.trySilentLogin({ 'webClientId' : '658095225206-i1amh87tv7mfjunlk4ifqb3ne2dc2mhr.apps.googleusercontent.com' }).then((res) => {
    //     var provider = firebase.auth.GoogleAuthProvider.credential(res.idToken);
    //     firebase.auth().signInWithCredential(provider).then((success) => {
    //       this.userProfile = success;
    //       this.fetchMyAccounts();
    //     }).catch((error) => {
    //       this.displayAlert(JSON.stringify(error), "Firebase silent login failed.");
    //     });
    //   }).catch((error) => {
    //     this.displayAlert(JSON.stringify(error), "Google Plus silent login failed.");
    //   });
    // }
    // else {
      this.af.auth.subscribe(res => {
        if(res) {
          this.userProfile = res.auth as any;
          this.fetchMyAccounts();
        }
        else {
          //this.displayAlert(JSON.stringify(res), "Firebase silent login failed.");
        }
      });
    // }
  }

  doLogin() {
    if (this.platform.is('android')) {
      this.googlePlusLogin();
    }
    else {
      this.fireBaseLogin();
    }
  }

  doLogout() {
    // if (this.platform.is('android')) {
    //   GooglePlus.logout().then(() => {
    //   }).catch(error => {
    //     this.displayAlert(JSON.stringify(error), "Google Plus logout failed.");
    //   });
    // }
    // else {
      this.af.auth.logout().then(reason => {
      }).catch(error => {
        //this.displayAlert(JSON.stringify(error), "Firebase logout failed.");
      });
    // }
    this.userProfile = null;
    this.accounts = null;
  }

  saveAccount() {
    if (this.activity != null) {
      if (this.activity.trim() == "") {
        this.presentToast("Please enter an Activity.");
        this.activity = null;
        setTimeout(() => {
          this.txtActivity.setFocus();
        }, 500);
        return;
      }
    } else {
      this.presentToast("Please enter an Activity.");
      this.activity = null;
        setTimeout(() => {
          this.txtActivity.setFocus();
        }, 500);
      return;
    }

    if (this.amount != null) {
      if (this.amount <= 0) {
        this.presentToast("Please enter an Amount.");
        this.amount = null;
        setTimeout(() => {
          this.txtAmount.setFocus();
        }, 500);
        return;
      }
    } else {
      this.presentToast("Please enter an Amount.");
      this.amount = null;
        setTimeout(() => {
          this.txtAmount.setFocus();
        }, 500);
      return;
    }

    this.accounts.push({ userID: this.userProfile.uid,
                         accountName: 'Savings',
                         activity: this.activity.trim(),
                         amount: this.amount });
    this.activity = null;
    this.amount = null;
  }

  ionViewWillEnter() {
    if (this.userProfile == null) {
      this.doSilentLogin();
    }
    else
    {
      this.fetchMyAccounts();
    }
    this.fetchToDos();
  }

  fetchToDos() {
    var client = new azureMobileClient.MobileServiceClient("https://cloudclient.azurewebsites.net");
    var todoTable = client.getTable("todoitem");

    todoTable
    .where({ deleted: false, complete: false })  // BUG on android -- only in prod???
    .orderBy("text")
    .read().then(results => {
      this.items = results;
    }, error => {
      this.items = null;
    });
  }
}
