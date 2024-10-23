import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentComponent} from './payment/payment.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentRoutingModule} from './payment-routing.module';
import {IonicModule} from "@ionic/angular";
import {MatButtonModule} from "@angular/material/button";
import {SharedModule} from "../shared/shared.modoule";



@NgModule({
  declarations: [
      PaymentComponent,
      PaymentFailComponent,
      PaymentSuccessComponent
  ],
    imports: [
        CommonModule,
        PaymentRoutingModule,
        IonicModule,
        MatButtonModule,
        SharedModule
    ]
})
export class PaymentModule { }
