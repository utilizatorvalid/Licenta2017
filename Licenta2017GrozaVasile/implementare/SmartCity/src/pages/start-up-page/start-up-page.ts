import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service'
import { Home } from '../home/home'
import { ISubscription } from "rxjs/Subscription";
/**
 * Generated class for the StartUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-start-up-page',
  templateUrl: 'start-up-page.html',
})
export class StartUpPage implements OnInit, OnDestroy {
  authenticated: Object;
  private logedInSubscription: ISubscription;
  private profileSubscription: ISubscription;
  backimg: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public menu: MenuController) {
    this.menu = menu;
    this.menu.enable(false, 'myMenu');
    this.backimg = 'img/letstart.jpg'



  }

  ngOnInit() {
    this.logedInSubscription = this.auth.isAuthenticated().subscribe(isAuth => {
      this.authenticated = isAuth;
      console.log('user status Subject', isAuth)
    })
    this.profileSubscription = this.auth.getProfile().subscribe(profile => {
      if (this.authenticated) {
        console.log("getting profile and setting root 2", profile);
        this.navCtrl.setRoot(Home, { user: profile });

      }
    });
  }
  ngOnDestroy() {
    console.log("onDestroy start-up page")
    this.logedInSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
  }
  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartUpPage');
  }

}
