import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { ISubscription } from 'rxjs/Subscription'

// import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
// import { ListPage } from '../pages/list/list';

import { StartUpPage } from '../pages/start-up-page/start-up-page'
import { Home } from '../pages/home/home'
import { Profile } from '../pages/profile/profile'
import { ToDo } from '../pages/to-do/to-do'
import { Settings } from '../pages/settings/settings'
import { EventListPage } from '../pages/event-list/event-list'
import { PlaceFormModalPage } from '../pages/place-form-modal/place-form-modal'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth/auth.service'

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  user: Object = null;
  rootPage: any;
  pages: Array<{ title: string, component: any, icon: string }>;
  authenticated: boolean;
  private logedInSubscription: ISubscription;
  private profileSubscription: ISubscription;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: Home, icon: "home" },
      { title: "Events Nearby", component: EventListPage, icon: "clipboard" },
      { title: 'To Do', component: ToDo, icon: "list" },
      { title: 'Settings', component: Settings, icon: "settings" },
      { title: 'Logout', component: null, icon: "log-out" },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.auth.storage.get('id_token').then(token => {
        this.auth.idToken = token;

        if (this.auth.authenticated()) {
          this.auth.storage.get('profile').then(profile => {

            // console.log("getting profile and set root for", profile);
            this.user = JSON.parse(profile);
            this.nav.setRoot(Home, {
              user: JSON.parse(profile)
            });
          });
        } else {
          this.nav.setRoot(StartUpPage);
        }
      }).catch(error => {
        console.log(error);
        this.auth.idToken = null;
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Add this function };
    });
  }
  ngOnInit() {
    this.logedInSubscription = this.auth.isAuthenticated().subscribe(isAuth => {
      this.authenticated = isAuth;
      console.log('app.component loadAuth', isAuth)
    })
    this.profileSubscription = this.auth.getProfile().subscribe(profile => {
      console.log("HERE", profile)
      if (this.authenticated) {
        console.log("app.component Change profile", profile);
        this.user = profile;
        //this.navCtrl.setRoot(Home,{user: JSON.stringify(profile)});                

      }
    });
  }
  ngOnDestroy() {
    console.log("onDestroy app.component page")
    this.logedInSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if (page.title === 'Logout') {
      console.log('Authentificate service Logout ^_^')
      this.auth.logout();
      this.nav.setRoot(StartUpPage);

    } else {
      this.nav.setRoot(page.component, {
        auth: this.authenticated,
        user: this.user
      });
    }
  }
}
