import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CheckoutComponent} from '../order/checkout/checkout.component';
import {ChooseItemsComponent} from '../order/choose-items/choose-items.component';
import {ChooseServiceComponent} from '../order/choose-service/choose-service.component';
import {DeliveryComponent} from '../order/delivery/delivery.component';
import {TakePictureComponent} from '../order/take-picture/take-picture.component';
import {PaymentComponent} from './payment/payment.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';

const routes: Routes = [
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'payment-fail',
    component: PaymentFailComponent
  },
  {
      path: 'payment-success',
    component: PaymentSuccessComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule { }
