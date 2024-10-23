import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {AppConstants} from '../../AppConstants';
import {SessionService} from "../../services/session.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {MatRadioChange} from "@angular/material/radio";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: '0px' })),
      state('false', style({ height: '85px' })),
      transition('false <=> true', animate(500))
    ])
  ],
})
export class ProfilePage implements OnInit {
  expandableCards = {
    lang: false,
  };

  lang = 'en'

  constructor(public session: SessionService, private router:Router, private translation: TranslationService) { }

  userData;

  ngOnInit() {
  // this.getUserData();
  }

  ionViewDidEnter() {
    this.userData =  this.session.getUser();
    this.lang = this.translation.getLang();
    console.log('we entered in profile');
  }

  // getUserData(){
  //   console.log(this.session.getUser());
  // }
  showLang = false;
  logOut(){
    this.session.logout();
    console.log('Login was success')
    this.router.navigateByUrl('/');
  }

    changeLang(event: MatRadioChange) {
    console.log('Change lang', event.value);
    const language = event.value;
    if (language ===  'en') {
      this.translation.changeLanguage('en');
    } else {
      this.translation.changeLanguage('fi');
    }
    }
}

