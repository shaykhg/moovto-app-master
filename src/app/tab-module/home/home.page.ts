import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage.service";
import {SessionService} from "../../services/session.service";
import {DataShareService} from "../../services/data-share.service";
import {UtilService} from "../../services/util.service";
import {ApiService} from "../../services/api.service";
import {TranslationService} from "../../services/translation.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    expandableCards = {
        pickup: false, parcel: false , parcelReturn : false
    };

    constructor(private api: ApiService,public translation:TranslationService, public util: UtilService, private storage: LocalStorageService, public data: DataShareService, private router: Router, private session: SessionService, private localStorage: LocalStorageService,private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.init();
        this.translation.getGreetings(this.translation.getLang());
    }

    async init(){
        const isFirstTime = !await this.localStorage.getBoolean('first');
        if (isFirstTime){
            // If user is coming for the first time he will need to see onboarding page
            this.router.navigateByUrl('/misc/onboarding');
        }

        // if (!this.session.isLoggedIn){
        //   // this.router.navigateByUrl('/auth/login');
        // }

    }

    pageRoute(page:number){
        if(page===1){
            this.router.navigateByUrl('/order/confirm-weight?type=delivery')
            this.data.setFlow(2);
        } else {
            this.router.navigateByUrl('/order/confirm-weight?type=return');

        }

    }

    async setFlow(flow: number) {
        await this.data.resetAllData();
        if (flow === 1) {
            await this.storage.setNumber('flow', flow);
            this.data.flow = flow;
            this.data.tabIndex = 0;
            await this.data.init();
        } else if (flow === 2) {
            await this.storage.setNumber('flow', flow);
            this.data.flow = flow;
            await this.data.init();
            setTimeout(()=>{
                this.router.navigateByUrl('/order/confirm-weight?type=delivery')
            })
        } else {
            this.router.navigateByUrl('/order/confirm-weight?type=return');
            await this.storage.setNumber('flow', flow);
        }
        this.data.setFlow(flow);
        // this.storage.clear();
    }

    findOrder(value: string) {
        this.api.getOrderDetails(value).subscribe( data => {
            console.log('this is entered value', value);
            console.log('this is order data', data);
            this.router.navigateByUrl('/history/order-details/' + value)
        }, error => {
            console.log('an error occurred while fetching data', error);
            this.util.presentAlert(this.translation.getLang() === 'en' ? 'Not found' : 'Ei löydetty', this.translation.getLang() === 'en' ? 'Order Id you enterd is incorrect. Please try again with correct order id.' : 'Antamasi tilaustunnus on väärä. Yritä uudelleen oikealla tilaustunnuksella.');

        })
    }
}
