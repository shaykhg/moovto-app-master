import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckoutComponent} from './checkout/checkout.component';
import {ChooseItemsComponent} from './choose-items/choose-items.component';
import {ChooseServiceComponent} from './choose-service/choose-service.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {TakePictureComponent} from './take-picture/take-picture.component';
import {ConfirmWeightComponent} from "./confirm-weight/confirm-weight.component";
import {SignatureComponent} from "./signature/signature.component";


const routes: Routes = [
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'choose-item',
        component: ChooseItemsComponent
    },
    {
        path: 'choose-service',
        component: ChooseServiceComponent
    },
    {
        path: 'delivery',
        component: DeliveryComponent
    },
    {
        path: 'take-picture',
        component: TakePictureComponent
    },
    {
        path:'confirm-weight',
        component:ConfirmWeightComponent
    },
    {
        path:'signature',
        component:SignatureComponent
    },
  {
    path: 'add-item',
    loadChildren: () => import('./add-item/add-item.module').then( m => m.AddItemPageModule)
  }

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule {
}
