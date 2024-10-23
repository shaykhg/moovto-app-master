import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../services/local-storage.service";
import {Router} from "@angular/router";
import {DataShareService} from "../../services/data-share.service";

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private router: Router, private data: DataShareService) { }

  ngOnInit() {
    // this.init();
  }

    // goToHome() {
    //     console.log('this is the value of first', this.local.getBoolean('first'));
    //     // this.router.navigateByUrl('/tabs/home');
    // }

  // async init(){
  //   const first = await this.local.getBoolean('first');
  //   console.log('this is first', first);
  //
  //   // if (first){
  //   //   // await this.router.navigate(['/tabs/home'], {replaceUrl: true});
  //   // } else {
  //   //   console.log('First Time in this app!');
  //   // }
  // }

    goToHome() {
        this.router.navigateByUrl('/tabs/home').then(()=> {
          this.data.resetAllData();
        });
    }
}
