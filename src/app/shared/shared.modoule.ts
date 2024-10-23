import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LanguagePipe} from '../pipe/language-pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [LanguagePipe],
  exports: [LanguagePipe],
  providers: [LanguagePipe]
})
export class SharedModule {}
