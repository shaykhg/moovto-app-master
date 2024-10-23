import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {LocalStorageService} from "./services/local-storage.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AgmCoreModule} from "@agm/core";
import { IonicStorageModule } from '@ionic/storage';
import "@capacitor-community/firebase-analytics";

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        IonicStorageModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: ''
        }),
    ],
    providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        LocalStorageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
