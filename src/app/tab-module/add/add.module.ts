import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPageRoutingModule } from './add-routing.module';

import { AddPage } from './add.page';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from "../../shared/shared.modoule";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddPageRoutingModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        SharedModule,
    ],
  declarations: [AddPage]
})
export class AddPageModule {}
