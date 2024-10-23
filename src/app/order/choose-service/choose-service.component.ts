import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlacePredictionService} from "../../services/place-prediction.service";
import {FormBuilder, Validators} from "@angular/forms";
import {UtilService} from "../../services/util.service";
import {DataShareService} from "../../services/data-share.service";
import {FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
import {Storage} from "@ionic/storage";
import {Platform} from "@ionic/angular";
import {MatDialog} from "@angular/material/dialog";
import {SignatureComponent} from "../signature/signature.component";
import {TranslationService} from "../../services/translation.service";
const { Filesystem } = Plugins;

const STORAGE_KEY = 'IMAGE_LIST';

@Component({
  selector: 'app-choose-service',
  templateUrl: './choose-service.component.html',
  styleUrls: ['./choose-service.component.scss'],
})
export class ChooseServiceComponent implements OnInit {
  isLinear = false;
  searchTerm;
  imageUri = '';
  imageData = '';
  resultsPick: any;

  public resultsDrop = [];
  placeNamePickup = '';

  dropAddress;
  placeNameDrop = '';
  // @ViewChild('imageCanvas') canvas: any;
  @ViewChild('imageCanvas', {static: false}) canvas: ElementRef;
  canvasElement: any;

  saveX: number;
  saveY: number;

  storedImages = [];
  myDialog;

  @ViewChild('pickupTerm', {static: false}) pickupTerm: HTMLInputElement
  pickUpAddress= this.formBuilder.group({
    building: ['', [Validators.required]],
    doorCode: ['', [Validators.required]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postCode: ['', [Validators.required, ]],
    name: ['', [Validators.required, ]],
    phone: ['', [Validators.required, ]],
  });

  dropUpAddress = this.formBuilder.group({
    building: ['', [Validators.required]],
    doorCode: ['', [Validators.required]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postCode: ['', [Validators.required, ]],
    name: ['', [Validators.required, ]],
    phone: ['', [Validators.required, ]],
  })




  constructor(public data: DataShareService,public translation:TranslationService, private plt:Platform, private storage: Storage,private placePredictionService: PlacePredictionService,private change: ChangeDetectorRef, private formBuilder:FormBuilder,public util:UtilService,public dialog: MatDialog) {

  }

  // ngAfterViewInit(): void {
  //   // Set the Canvas Element and its size
  //   this.canvasElement = this.canvas.nativeElement;
  //   this.canvasElement.width = this.plt.width() + '';
  //   this.canvasElement.height = 200;
  //   console.log(FilesystemDirectory.Documents);
  //   }

  ngOnInit() {


    // let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    // let scroll = this.content.getScrollElement();
    //
    // // Add preexisting scroll margin to fixed container size
    // itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    // scroll.style.marginTop = itemHeight + 'px';


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SignatureComponent, {
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.myDialog = result;
    });
  }




    pickupSubmit(){
    if (this.pickUpAddress.valid) {
      const order = {
        building: this.pickUpAddress.value.building,
        doorCode: this.pickUpAddress.value.doorCode,
        street: this.pickUpAddress.value.street,
        city: this.pickUpAddress.value.city,
        postCode: this.pickUpAddress.value.postCode,
        name: this.pickUpAddress.value.name,
        phone: this.pickUpAddress.value.phone
      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'Please Enter Valid Information' : 'Anna kelvolliset tiedot', 'Ok')
    }
  }

  dropUpSubmit(){
    if (this.dropAddress.valid) {
      const order = {
        building: this.dropAddress.value.building,
        doorCode: this.dropAddress.value.doorCode,
        street: this.dropAddress.value.street,
        city: this.dropAddress.value.city,
        postCode: this.dropAddress.value.postCode,
        name: this.dropAddress.value.name,
        phone: this.dropAddress.value.phone,

      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'Please Enter Valid Information' : 'Anna kelvolliset tiedot', 'Ok')
    }
  }




  async setDropAddress(address) {
    this.placeNameDrop = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {

      this.dropUpAddress.patchValue({
        postcode: data.postal,
        city: data.city,
        street: data.street,
      });
      // this.dropForm.controls.postcode.setValue(data.postcode);
      // this.dropForm.controls.city.setValue(data.city);
      // this.dropForm.controls.street.setValue(data.street);
      // this.dropForm.controls.postcode.setValue(data.postal);
      this.dropAddress = data;
      this.util.saveDrop(data);
      // this.dropAddress.enable();
    }, error => {
      console.log(error);
    });
  }

  // brandImg(){
  //
  // }


}
