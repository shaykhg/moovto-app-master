import {Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import {DomSanitizer} from "@angular/platform-browser";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {DataShareService} from "../../services/data-share.service";
import {TranslationService} from "../../services/translation.service";
const { Camera } = Plugins;

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.component.html',
  styleUrls: ['./take-picture.component.scss'],
})
export class TakePictureComponent implements OnInit, AfterViewInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  validImage = false;
  selectedImage;
  showConfirm = false;
  blobImage;

  constructor(private change: ChangeDetectorRef, public translation:TranslationService, private data: DataShareService, private util: UtilService, private api: ApiService, public dms: DomSanitizer, private plt: Platform, private actionSheetCtrl: ActionSheetController) { }

  ngAfterViewInit(): void {
    this.data.parcelDelTab = [false, true, true, true, true];
    console.log('Tabs afterviewinit', this.data.parcelDelTab);

  }

  ngOnInit() {
    console.log('Tabs', this.data.parcelDelTab);
  }

  async selectImageSource() {
    const buttons = [
      {
        text: this.translation.getLang() === 'en' ? 'Take Photo' : 'Ota valokuva',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: this.translation.getLang() === 'en' ? 'Choose From Photos Photo' : 'Valitse Valokuvat-valokuvasta',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: this.translation.getLang() === 'en' ? 'Choose a File' : 'Valitse tiedosto',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translation.getLang() === 'en' ? 'Select Image Source' : 'Valitse Kuvalähde',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    console.log('Just got in');
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    this.selectedImage = this.dms.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + image.base64String);
    const blobData = this.util.b64toBlob(image.base64String, `image/${image.format}`);
    console.log('In here conversion done');
    this.blobImage = blobData;
    if (this.blobImage.size < 1800000) {
      console.log('this is blob image', this.blobImage);
      this.data.receiptImage = blobData;
      this.data.setItemInParcelDel('receiptImage', blobData);
      console.log('this is after seting item in data', this.data.receiptImage)
      this.validImage = true;
      this.showConfirm = true;
      this.api.getParcelItem().subscribe(data=> {
        console.log('Item is now set in parel delv ########', data);
        this.data.setDelvItems(data[0]);
        this.data.getOrder();
      },error => {
        console.log('An error occured while setting Item', error);
      })
    } else {
      this.util.presentAlert(this.translation.getLang() === 'en' ? 'Size exceeded' : 'Koko ylitetty', this.translation.getLang() === 'en' ? 'Max size of image to select is 2mb' : 'Valittavan kuvan enimmäiskoko on 2 megatavua');
    }

  }

  confirmImage(valid: boolean) {
    this.showConfirm = valid;
    this.data.parcelDelTab = [false, true, true, true, true];
  }


  proceedWithImage() {
    this.data.parcelDelTabIndex = 0;
    this.data.parcelDelTab[1] = true;
    console.log(this.data.parcelDelTab, this.data.parcelDelTabIndex);
    this.change.detectChanges();
    this.data.parcelDelTab[1] = false;
    this.data.parcelDelTabIndex = 1;
    console.log(this.data.parcelDelTab, this.data.parcelDelTabIndex);

  }
}
