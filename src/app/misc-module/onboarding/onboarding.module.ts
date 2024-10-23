import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingPageRoutingModule } from './onboarding-routing.module';

import { OnboardingPage } from './onboarding.page';
import {SharedModule} from "../../shared/shared.modoule";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OnboardingPageRoutingModule,
        SharedModule,
        MatButtonModule,
    ],
  declarations: [OnboardingPage]
})
export class OnboardingPageModule {}
