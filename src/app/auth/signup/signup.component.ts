import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppConstants} from "../../AppConstants";
import {SessionService} from "../../services/session.service";
import {UtilService} from "../../services/util.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Platform} from "@ionic/angular";
import {TranslationService} from "../../services/translation.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

    signupForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required]]
    });
    private acceptedTerms = false;


    constructor(private platform: Platform,public translation:TranslationService , private api: ApiService, private formBuilder: FormBuilder, private router: Router, private  session: SessionService, private utils: UtilService) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
            this.router.navigateByUrl('/');
        });
    }

    ngOnInit() {
    }

    signup() {
        if (this.signupForm.value.password === this.signupForm.value.confirmPassword && this.signupForm.valid) {
            if (this.acceptedTerms) {
                const name = this.signupForm.value.email.split('@')[0];
                const body = {
                    email : this.signupForm.value.email,
                    password: this.signupForm.value.password,
                    username: this.signupForm.value.email,
                    name: name
                }

                this.api.setUser(body).subscribe(async data=>{
                    AppConstants.token = data.jwt;
                    await this.session.setToken(data.jwt);
                    await this.session.setUser(data.user);
                    AppConstants.userData = data;
                    this.router.navigateByUrl('/tabs/home');
                },error => {
                    console.log(error)
                    this.utils.getMsg(error.message,"Ok")
                });
            } else {
                this.utils.presentToast(this.translation.getLang() === 'en' ? 'Please accept terms and conditions' : 'Ole hyvä ja hyväksy käyttöehdot');
            }

        } else {
            this.utils.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors' : 'Korjaa lomakevirheet');
        }

    }


    accepted($event: MatCheckboxChange) {
        this.acceptedTerms = !this.acceptedTerms;
        console.log(this.acceptedTerms);
    }
}
