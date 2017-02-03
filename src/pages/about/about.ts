import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform, ToastController, LoadingController, Content } from 'ionic-angular';
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
  @ViewChild(Content) content: Content;
  userProfile: FirebaseAuthState = null;
  //accounts: FirebaseListObservable<any>;
  accounts: any;
  activity: string;
  amount: number;
  loader: any;

  constructor(public navCtrl: NavController, public af: AngularFire, public alertController: AlertController, public platform: Platform,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
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
        this.content.scrollToTop();
      }).catch((error) => {
        // if (this.loader != null)
        // {
        //   this.loader.dismiss();
        // }
        //this.displayAlert(JSON.stringify(error), "Firebase login failed.");
      });
    }).catch((error) => {
      // if (this.loader != null)
      // {
      //   this.loader.dismiss();
      // }
      //this.displayAlert(JSON.stringify(error), "Google Plus login failed.");
    });
  }

  fireBaseLogin() {
    this.af.auth.login({ provider: AuthProviders.Google }).then(a => {
      this.userProfile = a.auth as any;
      this.fetchMyAccounts();
      this.content.scrollToTop();
    }).catch(error => {
      // if (this.loader != null)
      // {
      //   this.loader.dismiss();
      // }
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

  // http://stackoverflow.com/questions/34374816/firebase-how-do-i-write-multiple-orderbychild-for-extracting-data/34375925#34375925
  // https://github.com/angular/angularfire2/issues/283
  fetchMyAccounts() {
    //this.accounts = this.af.database.list('/Accounts', {
    this.af.database.list('/Accounts', {
      query: {
        orderByChild: 'userID',
        equalTo: this.userProfile.uid
      }
    }).take(5).subscribe((value) => {
      this.accounts = value;
      if (this.loader != null) {
        this.loader.dismiss();
      }
    }, (error) => {
    }, () => {
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
          if (this.loader != null)
          {
            this.loader.dismiss();
          }
          //this.displayAlert(JSON.stringify(res), "Firebase silent login failed.");
        }
      });
    // }
  }

  doLogin() {
    if (this.loader == null)
    {
      this.loader = this.loadingCtrl.create({
        content: "Loading..."
      });
      this.loader.present();
    }

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
    this.accounts = null;
    this.userProfile = null;
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
                         amount: this.amount,
                         transactionDate: Date.now() });
    this.activity = null;
    this.amount = null;
  }

  ionViewWillEnter() {
    if (this.loader == null)
    {
      this.loader = this.loadingCtrl.create({
        content: "Loading..."
      });
      this.loader.present();
    }

    if (this.userProfile == null) {
      this.doSilentLogin();
    }
    else
    {
      this.fetchMyAccounts();
    }
  }

  ionViewDidEnter() {
    // if (this.loader != null) {
    //   this.loader.dismiss();
    // }
  }

  ionViewDidLoad() {
    // Called once per page creation - may want to put login stuff in here
  }
}
