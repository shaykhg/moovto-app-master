import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {SharedModule} from "../../shared/shared.modoule";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatCardModule,
        SharedModule,
    ],
  declarations: [ProfilePage,
  ChangePasswordComponent]
})
export class ProfilePageModule {}
