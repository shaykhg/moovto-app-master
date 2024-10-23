import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddItemPageRoutingModule } from './add-item-routing.module';

import { AddItemPage } from './add-item.page';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {SharedModule} from "../../shared/shared.modoule";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TooltipModule} from "ng2-tooltip-directive";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddItemPageRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        SharedModule,
        MatTooltipModule,
        TooltipModule

    ],
  declarations: [AddItemPage]
})
export class AddItemPageModule {}
