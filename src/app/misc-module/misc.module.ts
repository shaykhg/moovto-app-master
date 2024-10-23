import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactComponent} from './contact/contact.component';
import {HowitworksComponent} from './howitworks/howitworks.component';
import {NotificationsPageRoutingModule} from './notifications/notifications-routing.module';
import {OnboardingPageRoutingModule} from './onboarding/onboarding-routing.module';
import {TrackPageRoutingModule} from './track/track-routing.module';
import {MiscRoutingModule} from './misc-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from "@angular/material/select";
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.modoule";



@NgModule({
  declarations: [
      ContactComponent,
      HowitworksComponent,
  ],
    imports: [
        CommonModule,
        NotificationsPageRoutingModule,
        OnboardingPageRoutingModule,
        TrackPageRoutingModule,
        MiscRoutingModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        IonicModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class MiscModule { }
