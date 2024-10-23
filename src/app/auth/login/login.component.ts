import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AppConstants} from '../../AppConstants';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';
import {DataShareService} from '../../services/data-share.service';
import {LoadingController, Platform} from '@ionic/angular';
import '@codetrix-studio/capacitor-google-auth';
import {HttpClient, HttpParams} from '@angular/common/http';
// import {GooglePlus} from '@ionic-native/google-plus/ngx';
// import {Facebook} from '@ionic-native/facebook/ngx';
import {Storage} from '@ionic/storage';
import {AccessToken, FacebookLoginPlugin} from '@capacitor-community/facebook-login';
import {Capacitor, Plugins} from '@capacitor/core';
import {TranslationService} from '../../services/translation.service';
const { Device } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private storage: Storage, public translation: TranslationService , public http: HttpClient, public platform: Platform, private session: SessionService, private data: DataShareService,
              private api: ApiService, private formBuilder: FormBuilder, private router: Router,
              private utils: UtilService, private route: ActivatedRoute , public loadingController: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this.router.navigateByUrl('/');
    });
    this.setupFbLogin();
  }
  private setRoute: string;
  public device = '';
  fbLogin: FacebookLoginPlugin;
  private token: AccessToken;
  private showAppleSignIn = false;

  loginForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email]]
  });

  async setupLogin(){
    const device = await Device.getInfo();
    this.showAppleSignIn = device.platform === 'ios';
  }

  // ionic cordova plugin add cordova-plugin-facebook-connect --variable APP_ID="2984858541838279" --variable APP_NAME="app.moov.to"

  ngOnInit() {
    this.device = Capacitor.platform;
    this.route.params.subscribe(params => {
      this.setRoute =  this.route.snapshot.queryParamMap.get('flow');
      console.log('this is query param', this.setRoute );
    });
  }



  openAppleSignIn() {
    const { SignInWithApple } = Plugins;
    SignInWithApple.Authorize()
        .then(async (res) => {
          if (res.response && res.response.identityToken) {
            const user = res.response;
            const appleUser = {
              email: user.email,
              name: user.givenName,
              password: user.user
            };
            this.registerSocial(appleUser);
          } else {
            await this.utils.presentAlert(this.translation.getLang() === 'en' ? 'Login Failed' : 'Kirjautuminen epäonnistui', this.translation.getLang() === 'en' ? 'An error occurred while login!' : 'Sisäänkirjautumisen aikana tapahtui virhe!');
          }
        })
        .catch(async (response) => {
          await this.utils.presentAlert(this.translation.getLang() === 'en' ? 'Login Failed' : 'Kirjautuminen epäonnistui', this.translation.getLang() === 'en' ? 'An error occurred while login!' : 'Sisäänkirjautumisen aikana tapahtui virhe!');
        });
  }

  login(email, value){
    this.api.doLogin(email, value).subscribe(async data => {
      // do something with data
      console.log('Login was success', data, );

      AppConstants.token = data.jwt;
      await this.session.setToken(data.jwt);
      await this.session.setUser(data.user);
      AppConstants.userData = data;
      if (this.setRoute === '1') {
        this.router.navigateByUrl('/order/delivery').then(() => {
          if (this.data.couponApplied) {
            this.data.tabs = [true, true, true, false];
          } else {
            this.data.tabs = [false, false, false, false];
          }
          this.data.tabIndex = 0;
          setTimeout(() => {
            this.data.tabIndex = 3;
          }, 100);
        });

        console.log('From flow 1');
      } else if (this.setRoute === '2') {
        this.router.navigateByUrl('/order/choose-service').then(() => {
          if (this.data.couponApplied) {
            this.data.tabs = [true, true, true, true, false];
          } else {
            this.data.tabs = [false, false, false, false, false];
          }
          this.data.parcelDelTabIndex = 0;
          setTimeout(() => {
            this.data.parcelDelTabIndex = 4;
          }, 100);

        });
        console.log('From flow 2');
      } else {
        this.router.navigateByUrl('tabs/home');
      }
    }, error => {
      console.log(error);
      this.utils.getMsg(error.message, 'Ok');
      this.utils.presentAlert(this.translation.getLang() === 'en' ? 'Login Error' : 'Kirjautumisvirhe', this.translation.getLang() === 'en' ? 'Unable to login using with provided credentials. Use the provider which you used to create the account Apple/Facebook/Google/Email.' : 'Sisäänkirjautuminen ei onnistu annettujen kirjautumistietojen avulla. Käytä palveluntarjoajaa, jota käytit luomaan tilin Apple / Facebook / Google / Email.');
    });
  }


  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: this.translation.getLang() === 'en' ? 'Please wait...' : 'Odota...'
    });

    try {
      const user = await Plugins.GoogleAuth.signIn();
      console.log('this is google user', user);
      const mUser = {
          name: user.name ? user.name : user.email.split('@')[0],
          email: user.email,
          image: user.imageUrl,
          password: user.id
        };
      this.registerSocial(mUser);
    } catch (e) {
      console.log('An error occurred in google login!', e);
      await loading.dismiss();
      await this.utils.presentAlert(this.translation.getLang() === 'en' ? 'Google Login' : 'Google-kirjautuminen', this.translation.getLang() === 'en' ? 'Unable to login using google.' : 'Kirjautuminen Googleen ei onnistu.');
    }
    // this.googlePlus.login({
    //   scopes: '',
    //   webClientId: '160217957773-8lckhn4ogcs84ae4ipl80iivjkql3rop.apps.googleusercontent.com',
    //   offline: true
    // }).then(user => {
    //   loading.dismiss();
    //   console.log('User google', JSON.stringify(user));
    //   const mUser = {
    //     name: user.email.split('@')[0],
    //     email: user.email,
    //     image: user.imageUrl,
    //     password: user.user_id
    //   };
    //   this.registerSocial(mUser);
    // }, err => {
    //   console.log('Google Login ', JSON.stringify(err));
    //   loading.dismiss();
    // });

  }



  async doFbLogin() {
    const loading = await this.loadingController.create({
      message: this.translation.getLang() === 'en' ? 'Please wait...' : 'Odota...'
    });
    this.presentLoading(loading);
    const permission = new Array<string>();

    const permissions = ['public_profile', 'email'];

    const result = await this.fbLogin.login({ permissions });

    console.log('this is result of fb login', result);

    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
      this.http.get(url).subscribe(res => {
        const user: any = res;
        user.picture = 'https://graph.facebook.com/' + this.token.userId + '/picture?type=large';
        // now we have the users info, let's save it in the NativeStorage
        console.log('Graph response', JSON.stringify(user));
        this.registerSocial({
          name: user.name,
          email: user.email,
          image: user.picture,
          password: this.token.userId
        });
      });
    } else {
      await loading.dismiss();
      // Login failed
    }
  }

   registerSocial(user) {
    const body = new HttpParams()
        .set('name', user.name)
        .set('avatar', user.image)
        .set('email', user.email)
        .set('username', user.email)
        .set('password', user.password)
        .set('gender', 'Male');
    console.log('This is user before attempting register', user);

    this.http.post(AppConstants.API.REGISTER, body).subscribe(async response => {

      const result = JSON.parse(JSON.stringify(response));
      this.storage.set('token', result.jwt);
      this.storage.set('login', true);
      this.session.setUser(result.user);
      this.loadingController.dismiss();
      if (this.setRoute === '1') {
        this.router.navigateByUrl('/order/delivery').then(() => {
          if (this.data.couponApplied) {
            this.data.tabs = [true, true, true, false];
          } else {
            this.data.tabs = [false, false, false, false];
          }
          this.data.tabIndex = 0;
          setTimeout(() => {
            this.data.tabIndex = 3;
          }, 100);
        });

        console.log('From flow 1');
      } else if (this.setRoute === '2') {
        this.router.navigateByUrl('/order/choose-service').then(() => {
          if (this.data.couponApplied) {
            this.data.tabs = [true, true, true, true, false];
          } else {
            this.data.tabs = [false, false, false, false, false];
          }
          this.data.parcelDelTabIndex = 0;
          setTimeout(() => {
            this.data.parcelDelTabIndex = 4;
          }, 100);

        });
        console.log('From flow 2');
      } else {
        this.router.navigateByUrl('tabs/home');
      }
      AppConstants.token = result.jwt;
      await this.session.setToken(result.jwt);
      await this.session.setUser(result.user);
    }, err => {
      console.log('error message when try to register', err.message);
      console.log('complete error  when try to register', err);
      this.loadingController.dismiss();
      console.log('This is user before attempting login', user);
      this.login(user.email, user.password);
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async setupFbLogin() {
    // Use the native implementation inside a real app!
    const { FacebookLogin } = Plugins;
    this.fbLogin = FacebookLogin;
  }


}
