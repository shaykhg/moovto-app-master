import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CameraResultType, CameraSource, Plugins} from "@capacitor/core";
import {ActionSheetController, Platform} from "@ionic/angular";
import {DomSanitizer} from "@angular/platform-browser";
import {UtilService} from "../../services/util.service";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {ApiService} from "../../services/api.service";
import {TranslationService} from "../../services/translation.service";
const { Camera } = Plugins;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  contactForm = this.formBuilder.group({
    issue: ['', [Validators.required]],
    desc: ['', [Validators.required, Validators.maxLength(300)]],

  })
  private blobImage: Blob;
  public selectedImage;
  private validImage;
  private showConfirm;
  private issuePic;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(public formBuilder: FormBuilder, public  translation:TranslationService, private plt: Platform, public dms: DomSanitizer,
              private actionSheetCtrl: ActionSheetController, private util: UtilService, private router: Router, private session: SessionService, private api: ApiService) { }

  ngOnInit() {}

  submitIssue() {
    const body = this.contactForm.value;
    body.user = this.session.getUser().id;
    if (this.issuePic) {
      body.img = this.issuePic;
    }
    console.log('clicked to submit', body);
    this.api.sendIssue(body).subscribe( data => {
      console.log('this is issue data', data);
      this.util.presentToast(this.translation.getLang() === 'en' ? 'Your query sent successfully' : 'Kyselysi lähetys onnistui')
      this.router.navigateByUrl('/tabs/profile')
    }, error => {
      this.util.presentToast(this.translation.getLang() === 'en' ? 'An error occurred while submitting query' : 'Kyselyä lähetettäessä tapahtui virhe');
      this.router.navigateByUrl('/tabs/profile')
      console.log('an error occurred', error);

    })

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

    console.log('Just got in');
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
      this.selectedImage = this.dms.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + image.base64String);
      console.log('this is blob image', this.blobImage);
      // this.data.receiptImage = blobData;
      // this.data.setItemInParcelDel('receiptImage', blobData);
      this.validImage = true;
      this.showConfirm = true;

      // upload image
      await this.util.presentLoading('Uploading image...');
      try {
        const issueImage = new FormData();
        issueImage.append('files', this.blobImage, `file-${new Date().getTime()}.jpg`);
        const IssueResult =  await this.api.uploadImage(issueImage).toPromise();
        this.issuePic = IssueResult[0].id;
        this.sendEmail();
        await this.util.dismissLoading();
        this.sendEmail();

      } catch (e) {
        await this.util.presentToast(this.translation.getLang() === 'en' ? 'Unknown error occurred while uploading your image!' : 'Kuvaa lähetettäessä tapahtui tuntematon virhe!');
        console.log('Error in uploading!', e);

      }


      // this.api.getParcelItem().subscribe(data=> {
      //     console.log('Item is now set in parel delv ########', data);
      //     // this.data.setDelvItems(data[0]);
      //     // this.data.getOrder();
      // },error => {
      //     console.log('An error occured while setting Item', error);
      // })
    } else {
      this.util.presentAlert(this.translation.getLang() === 'en' ? 'Size exceeded' : 'Koko ylitetty', this.translation.getLang() === 'en' ? 'Max size of image to select is 2mb' : 'Valittavan kuvan enimmäiskoko on 2 megatavua');
      await this.util.dismissLoading();

    }

  }

  sendEmail() {
    const body = {
      to: 'sherjeelk@hotmail.com',
      name: this.session.getUser().name,
      subject: 'Issue in application',
      type: 'customer',
      text: `Hi  \n This email is to inform you that ${this.session.getUser().name} has Reported an issue regarding ${this.contactForm.value.issue}  \n for more details please check dashboard \n user id - ${this.session.getUser().id} \n Thanks`,
      html: `<p>Hi ,</p> <p>This email is to inform you that  ${this.session.getUser().name}  has Reported an issue regarding ${this.contactForm.value.issue}</p><p> for more details please check dashboard</p><p>user id - ${this.session.getUser().id}</p><p>Thanks</p>`
    };

    this.api.sendEmail(body).subscribe(res => console.log(res));
  }

}
