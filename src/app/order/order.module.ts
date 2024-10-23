import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutComponent} from './checkout/checkout.component';
import {ChooseItemsComponent} from './choose-items/choose-items.component';
import {ChooseServiceComponent} from './choose-service/choose-service.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {TakePictureComponent} from './take-picture/take-picture.component';
import {OrderRoutingModule} from './order-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {ConfirmWeightComponent} from "./confirm-weight/confirm-weight.component";
import {IonicModule} from "@ionic/angular";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {AddressComponent} from "./address/address.component";
import {ShipmentPickupComponent} from "./shipment-pickup/shipment-pickup.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {TimeScheduleComponent} from "./time-schedule/time-schedule.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {DeliveryLocationComponent} from "./delivery-location/delivery-location.component";
import {MatIconModule} from "@angular/material/icon";
import {ParcelReturnPickupComponent} from "./parcel-return-pickup/parcel-return-pickup.component";
import {ParcelReturnDropComponent} from "./parcel-return-drop/parcel-return-drop.component";
import {ParcelDelDropComponent} from "./parcel-del-drop/parcel-del-drop.component";
import {MatRadioModule} from "@angular/material/radio";
import {SharedModule} from "../shared/shared.modoule";
import {TranslatePipe} from "../translate.pipe";
import {SignatureComponent} from "./signature/signature.component";
import {TooltipModule} from "ng2-tooltip-directive";


@NgModule({
    declarations: [
        CheckoutComponent,
        ChooseItemsComponent,
        ChooseServiceComponent,
        DeliveryComponent,
        TakePictureComponent,
        ConfirmWeightComponent,
        AddressComponent,
        ShipmentPickupComponent,
        TimeScheduleComponent,
        DeliveryLocationComponent,
        ParcelReturnPickupComponent,
        ParcelReturnDropComponent,
        ParcelDelDropComponent,
        SignatureComponent,
        TranslatePipe,
    ],
    imports: [
        CommonModule,
        OrderRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatStepperModule,
        MatInputModule,
        MatCardModule,
        NgxMaterialTimepickerModule,
        FormsModule,
        IonicModule,
        MatTabsModule,
        MatDialogModule,
        MatNativeDateModule,
        MatSelectModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatOptionModule,
        MatIconModule,
        MatRadioModule,
        SharedModule,
        TooltipModule,

    ],
    exports: [TranslatePipe]
})
export class OrderModule {
}
