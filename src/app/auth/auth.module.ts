import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {AuthRoutingModule} from './auth-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {LocalStorageService} from "../services/local-storage.service";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {IonicModule} from "@ionic/angular";
import {SharedModule} from "../shared/shared.modoule";

@NgModule({
  declarations: [
      LoginComponent,
      SignupComponent,
      ForgetPasswordComponent
  ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        CommonModule,
        AuthRoutingModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatSnackBarModule,
        IonicModule,
        SharedModule
    ],
    providers: [LocalStorageService]
})
export class AuthModule { }
