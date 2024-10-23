import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {CameraResultType, CameraSource, Plugins} from "@capacitor/core";
import {ActionSheetController, Platform} from "@ionic/angular";
import {DomSanitizer} from "@angular/platform-browser";
import {DataShareService} from "../../services/data-share.service";
import {AppConstants} from "../../AppConstants";
import {TranslationService} from "../../services/translation.service";

const {Camera} = Plugins;

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
    blobImage;
    selectedImage;
    validImage = false;
    showConfirm = false;
    avatar = '';

    editForm = this.formBuilder.group({
        profile: [''],
        fname: ['', [Validators.required, Validators.maxLength(20)]],
        lname: ['', [Validators.maxLength(20)]],
        phone: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', [Validators.required,]]
    })
    private profilePic: any;

    constructor(private plt: Platform,public  translation:TranslationService, private data: DataShareService, public dms: DomSanitizer, private actionSheetCtrl: ActionSheetController, private util: UtilService, private formBuilder: FormBuilder, private router: Router, public session: SessionService, private api: ApiService) {
    }

    ngOnInit() {
        setTimeout(() => {
                this.getUserData()

            }, 300
        )
    }

    getUserData() {
        let userData = this.session.getUser()
        console.log(userData)
        this.editForm.patchValue({
            profile: '',
            fname: userData.name,
            lname: userData.last_name,
            phone: userData.mobile,
            email: userData.email
        });

        try {
            this.avatar = userData.profile_pic ? AppConstants.BASE_URL + userData.profile_pic.url : 'assets/profile/profile_pic.jpeg';
        } catch (e) {
            console.log('Error in loading avatar!', e);
        }
    }

    async updateProfile() {
        if (this.editForm.valid) {
            const body: any = {
                name: this.editForm.value.fname,
                last_name: this.editForm.value.lname,
                mobile: this.editForm.value.phone,
                email: this.editForm.value.email,
            }
            if (this.selectedImage) {
                await this.uploadImage();
                body.profile_pic = this.profilePic;
            }
            await this.util.presentLoading('Updating profile changes...');
            this.api.updateUser(body).subscribe(async data => {
                console.log('updated data', data);
                this.session.setUser(data);
                await this.util.presentToast(this.translation.getLang() === 'en' ? 'Profile updated successfully!' : 'Profiilin päivitys onnistui!');
                await this.util.dismissLoading();
                this.getUserData();
                // this.router.navigateByUrl('/');
            }, async error => {
                await this.util.dismissLoading();
                await this.util.presentAlert(this.translation.getLang() === 'en' ? 'Update Error' : 'Päivitysvirhe', 'An error occurred while updating your profile')
                console.log('An error occurred while updating profile', error);
            })
        } else {
            this.util.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors' : 'Korjaa lomakevirheet');
        }
    }


    async selectImageSource() {
        const buttons = [
            {
                text: 'Take Photo',
                icon: 'camera',
                handler: () => {
                    this.addImage(CameraSource.Camera);
                }
            },
            {
                text: 'Choose From Photos Photo',
                icon: 'image',
                handler: () => {
                    this.addImage(CameraSource.Photos);
                }
            }
        ];

        // Only allow file selection inside a browser
        if (!this.plt.is('hybrid')) {
            buttons.push({
                text: 'Choose a File',
                icon: 'attach',
                handler: () => {
                    this.fileInput.nativeElement.click();
                }
            });
        }

        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select Image Source',
            buttons
        });
        await actionSheet.present();
    }

    async addImage(source: CameraSource) {
        const image = await Camera.getPhoto({
            quality: 60,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source
        });

        const blobData = this.util.b64toBlob(image.base64String, `image/${image.format}`);
        console.log('In here conversion done');
        this.blobImage = blobData;
        if (this.blobImage.size < 1800000) {
            // show image in view
            this.avatar = undefined;
            this.selectedImage = this.dms.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + image.base64String);
        } else {
            this.util.presentAlert(this.translation.getLang() === 'en' ? 'Size exceeded' : 'Koko ylitetty', this.translation.getLang() === 'en' ? 'Max size of image to select is 2mb' :'Valittavan kuvan enimmäiskoko on 2 megatavua');
        }

    }


    async uploadImage(){
        await this.util.presentLoading('Uploading your profile picture...');
        console.log('this is blob image', this.selectedImage);
        // this.data.receiptImage = blobData;
        // this.data.setItemInParcelDel('receiptImage', blobData);
        this.validImage = true;
        this.showConfirm = true;
        // upload image

        try {
            const profileImage = new FormData();
            profileImage.append('files', this.blobImage, `file-${new Date().getTime()}.jpg`);
            const receiptResult = await this.api.uploadImage(profileImage).toPromise();
            this.profilePic = receiptResult[0].id;
            this.avatar = AppConstants.BASE_URL + receiptResult[0].url;
            await this.util.dismissLoading();
        } catch (e) {
            console.log('Error in uploading!', e);
            await this.util.presentToast(this.translation.getLang() === 'en' ? 'Unknown error occurred while uploading your image!' : 'Kuvaa lähetettäessä tapahtui tuntematon virhe!');
        }
    }
}
