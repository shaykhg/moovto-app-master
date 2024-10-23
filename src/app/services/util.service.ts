import {Injectable} from '@angular/core';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Storage} from '@ionic/storage';
import {Router} from "@angular/router";
import {Capacitor} from "@capacitor/core";
import {FirebaseAnalytics} from "@capacitor-community/firebase-analytics";
import * as moment from 'moment';
import {DataShareService} from "./data-share.service";
import {LocalStorageService} from "./local-storage.service";
import {TranslationService} from "./translation.service";

@Injectable({
    providedIn: 'root'
})
/**
 * This services contains variables and functions which
 * are required globally in multiple components
 */
export class UtilService {

    public isDesktop = false;
    private page = 0;
    loading: HTMLIonLoadingElement;
    pickupAddress;
    private dropAddress: any;
    lang = 'eng';
    greeting;
    constructor(private local: LocalStorageService,public translation:TranslationService, private platform: Platform, public alertController: AlertController, private data: DataShareService,
                public toastController: ToastController, public loadingController: LoadingController, private snackbar:MatSnackBar, private storage: Storage, private router:Router) {
                this.isDesktop = this.platform.is('desktop');
        console.log('Desktop ? ', this.isDesktop);
    }

    /**
     * This function supply status colors based on status text for meetings page
     * @param status Status of the meeting
     */
    public getStatus(status: string) {
        if (status === 'pending') {
            return '#ff5722';
        } else if (status === 'completed') {
            return '#00701a';
        } else if (status === 'scheduled') {
            return '#006db3';
        } else if (status === 'ongoing') {
            return '#9c27b0';
        } else if (status === 'failed') {
            return '#f44336';
        } else {
            return '#212121';
        }
    }

    /**
     * This function can be used to display alerts by passing
     * title and message.
     * @param title Title of your message
     * @param message Message which you want to display
     * @param subtitle Optional field, used to display subtitle of dialog
     */
    async presentAlert(title: string, message: string, subtitle?: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: title,
            subHeader: subtitle ? subtitle : null,
            message,
            buttons: ['OK']
        });

        await alert.present();
    }

    /**
     * This function can be used to created alert with custom button
     * and actions
     * @param positive Name oof the positive button
     * @param negative Name of the negative button
     * @param message Message content to be displayed on alert
     * @param title Title of the message
     * @param subtitle Subtitle of the alert
     */
    async presentAlertConfirm(positive, negative, message, title, subtitle?: string) {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: title,
                subHeader: subtitle ? subtitle : null,
                message,
                buttons: [{
                    text: negative,
                    role: 'cancel',
                    handler: () => {
                        reject(false);
                    }
                }, {
                    text: positive,
                    handler: () => {
                        resolve(true);
                    }
                }]
            });
            await alert.present();
        });
    }

    /**
     * This function is to be used to display ion toast or snackbar style
     * message using ToastController
     * @param message This is the text which will be displayed on snackbar
     * @param time This is the duration for how long message should be visible
     */
    async presentToast(message: string, time: number = 2000) {
        const toast = await this.toastController.create({
            message,
            duration: time
        });
        await toast.present();
    }

    /**
     * This is to be used to display an alert style progress
     * for an ongoing event or API calls, you should call dismissLoading
     * function to dismiss the dialogue
     * @param message Text of what message needs to displayed
     */
    async presentLoading(message: string = 'Please wait...') {
        if (!this.loading){
            this.loading = await this.loadingController.create({
                message,
            });
            console.log(this.loading);
            await this.loading.present();
        } else {
            console.log('Cannot show more than one loading!');
        }
    }

    /**
     * Dismiss the existing loading bar displaying currently
     */
    async dismissLoading() {
        if (this.loading) {
            console.log('Non Empty loading@!')
            await this.loading.dismiss();
        } else {
            console.log('Empty loading@!')
        }
    }

    getMsg(message, action){
        this.snackbar.open(message, action, {duration: 2000
        })
    }
    savePickup(pickup) {
        this.storage.set('pickup', pickup).then(r => {
                this.pickupAddress = r;
            }
        );
    }
    saveDrop(drop) {
        this.storage.set('drop', drop).then(r => {
                this.dropAddress = r;
            }
        );
    }

    /**
     * Used to navigate to other pages in Tabs
     * @param page
     */
    setPage(page: number){
        this.page = page;
    }

    /**
     * Get current selected page on tabs
     */
    getPage(){return this.page;}

    sendPageView(title, params?, log = false) {
        // gtag('config', 'UA-179861101-1', {'page-name': title});
        if (Capacitor.isNative){
            console.log('Request to log screen received');
            FirebaseAnalytics.setScreenName({
                nameOverride: "",
                screenName: title
            });

            if (log){
                FirebaseAnalytics.logEvent({
                    name: title,
                    params: params
                });
            }

        } else {
            console.log('Ignoring request because platform is not native');
        }
    }

    public getHumanShortDate(date) {
        return moment(date).format('DD-MMM-YYYY');
    }

    public returnTime(date) {
        return moment(date).format('HH:mm');
    }

    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

   async showWarning(type: number) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: this.translation.getLang() === 'en' ? 'Are you sure?' : 'Oletko varma?',
            message: this.translation.getLang() === 'en' ? 'All of you filled data will be lost!!' : 'Kaikki teidän täyttämäsi tiedot menetetään !!',
            buttons: [
                {
                    text: this.translation.getLang() === 'en' ? 'Cancel' : 'Peru',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.data.resetAllData();
                        setTimeout(()=> {
                            this.router.navigateByUrl('/')
                        },100);
                    }
                }
            ]
        });

        await alert.present();
    }





}
