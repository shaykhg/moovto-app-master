import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataShareService} from "../../services/data-share.service";
import {Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {FormBuilder, Validators} from "@angular/forms";
import {UtilService} from "../../services/util.service";
import {MatDialog} from "@angular/material/dialog";
import {SignatureComponent} from "../signature/signature.component";
import {AppConstants} from "../../AppConstants";
import {ApiService} from "../../services/api.service";
import {LanguagePipe} from "../../pipe/language-pipe";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-parcel-del-drop',
  templateUrl: './parcel-del-drop.component.html',
  styleUrls: ['./parcel-del-drop.component.scss'],
})
export class ParcelDelDropComponent implements OnInit, OnDestroy {
  isLinear = false;
  searchTerm;
  imageUri = '';
  imageData = '';
  resultsPick: any = [];

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


  @ViewChild('pickupTerm', {static: false}) pickupTerm: HTMLInputElement;
  pickUpAddress = this.formBuilder.group({
    building: ['', [Validators.required]],
    doorCode: [''],
    // street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postCode: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.maxLength(10)]],
  });

  // dropUpAddress = this.formBuilder.group({
  //   building: ['', [Validators.required]],
  //   doorCode: [''],
  //   street: ['', [Validators.required]],
  //   city: ['', [Validators.required]],
  //   postCode: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
  //   name: ['', [Validators.required, ]],
  //   phone: ['', [Validators.required, ]],
  // })
  private pickUpAddressData: any;




  constructor(public lang: LanguagePipe,public translation: TranslationService, private toast: ToastController, private api: ApiService, private data: DataShareService, private plt:Platform, private storage: Storage,private placePredictionService: PlacePredictionService,private change: ChangeDetectorRef, private formBuilder:FormBuilder,public util:UtilService,public dialog: MatDialog) {

  }

  // ngAfterViewInit(): void {
  //   // Set the Canvas Element and its size
  //   this.canvasElement = this.canvas.nativeElement;
  //   this.canvasElement.width = this.plt.width() + '';
  //   this.canvasElement.height = 200;
  //   console.log(FilesystemDirectory.Documents);
  //   }

  ngOnInit() {

    console.log('HOme', this.lang.transform('home'))
    // let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    // let scroll = this.content.getScrollElement();
    //
    // // Add preexisting scroll margin to fixed container size
    // itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    // scroll.style.marginTop = itemHeight + 'px';
    try {
      this.data.updateForms.subscribe((value:any) => {
        console.log('Getting value from form', value);
        if (value){
          this.pickUpAddress.get('name').setValue(value.name);
          this.pickUpAddress.get('phone').setValue(value.phone);
        }
      });
    }catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      this.loadAddress();
    }, 150);
  }


  async loadAddress(){
    if (this.data.parcelDelOrder){
      if (this.data.parcelDelOrder.drop){
        console.log('this is pickup location data', this.data.parcelDelOrder.pickup);
        this.pickUpAddress.patchValue(this.data.parcelDelOrder.drop);
        this.placeNamePickup = this.data.parcelDelOrder.drop.googleLoc;
      }
    }
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
        // street: this.pickUpAddress.value.street,
        city: this.pickUpAddress.value.city,
        postCode: this.pickUpAddress.value.postCode,
        name: this.pickUpAddress.value.name,
        phone: this.pickUpAddress.value.phone
      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'Please Enter Valid Information' :'Anna kelvolliset tiedot', 'Ok')
    }
  }

  dropUpSubmit(){
    if (this.dropAddress.valid) {
      const order = {
        building: this.dropAddress.value.building,
        doorCode: this.dropAddress.value.doorCode,
        // street: this.dropAddress.value.street,
        city: this.dropAddress.value.city,
        postCode: this.dropAddress.value.postCode,
        name: this.dropAddress.value.name,
        phone: this.dropAddress.value.phone,

      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'Please Provide Valid Information' : 'Anna kelvolliset tiedot', 'Ok')
    }
  }




  // async setDropAddress(address) {
  //   this.placeNameDrop = address.description;
  //   this.placePredictionService.getDetails(address.place_id).subscribe(data => {
  //
  //     this.dropUpAddress.patchValue({
  //       postcode: data.postal,
  //       city: data.city,
  //       street: data.street,
  //     });
  //     this.dropUpAddress.controls.postcode.setValue(data.postcode);
  //     this.dropUpAddress.controls.city.setValue(data.city);
  //     this.dropUpAddress.controls.street.setValue(data.street);
  //     this.dropUpAddress.controls.postcode.setValue(data.postal);
  //     this.dropAddress = data;
  //     this.util.saveDrop(data);
  //     // this.dropAddress.enable();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // brandImg(){
  //
  // }

  async setPickUpAddress(address) {
    console.log('this is addresss***********', address);
    this.placeNamePickup = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {
      console.log(data);
      // this.pickupForm.patchValue({
      //     postcode: data.postcode,
      //     city: data.city,
      //     street: data.street,
      // });
      this.pickUpAddress.controls.postCode.markAsDirty();
      this.pickUpAddress.controls.postCode.setValue(data.postcode);
      this.pickUpAddress.controls.city.setValue(data.city);
      // this.pickUpAddress.controls.street.setValue(data.street);
      this.pickUpAddress.controls.postCode.setValue(data.postal);
      this.pickUpAddressData = data;
      this.util.saveDrop(data);
      this.data.parcelDelDropLat = data;
      this.resultsPick = [];
      // this.pickUpAddress.enable();
      this.change.detectChanges();
      this.data.parcelDelTab = [false, false, false, true, true];

      // this.pickupForm.markAsDirty();
      // this.pickupForm.markAsPristine();
    }, error => {
      console.log(error);
    });
  }

  handleSearch(term, type) {
    this.searchTerm = term;
    console.log('this is search term', term);
    if (this.searchTerm === '') {
      return;
    } else {
      if (type === 1) {
        this.resultsPick = [];
        this.placePredictionService.getPlacePredictions(term).subscribe(data => {
          console.log('********************', data);
          if (data) {
            this.resultsPick = data;
            this.change.detectChanges();
          } else {
          }

        }, error => {
        });
      } else {
        this.resultsDrop = [];
        this.placePredictionService.getPlacePredictions(term).subscribe(data => {
          console.log('********************', data);
          if (data) {
            this.resultsDrop = data;
            this.change.detectChanges();
          } else {
          }

        }, error => {
        });
      }

    }

  }

  pickup() {
    if (this.pickUpAddress.valid) {
      const order = {
        building: this.pickUpAddress.value.building,
        doorCode: this.pickUpAddress.value.doorCode,
        // street: this.pickUpAddress.value.street,
        city: this.pickUpAddress.value.city,
        postCode: this.pickUpAddress.value.postCode,
        name: this.pickUpAddress.value.name,
        phone: this.pickUpAddress.value.phone
      }
      // this.data.setOrder(order)
      console.log('form is valid')
      this.setAddress();
    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'All Fields Are Mandatory' : 'Kaikki kentät ovat pakollisia', 'Ok')
    }


  }

  async setAddress() {

    if (this.pickUpAddress.valid){
      const postcodes = ['01720', '13500', '13100', '00390', '00410', '00420', '00120', '01700'];
      if (!postcodes.includes(this.pickUpAddress.value.postCode)){
        await this.util.presentAlert(this.translation.getLang() === 'en' ? 'Service Unavailable': 'palvelu ei saatavilla', this.translation.getLang() === 'en' ? 'Sorry we currently don’t deliver at your postcode. But keep looking, we are expanding fast 😃' : 'Pahoittelut emme tällä hetkellä kuljeta valitsemaasi postiosoitteeseen, mutta laajennamme toimitusalueitamme jatkuvasti. 😃');
        return;
      }
      await this.data.setAddress(this.pickUpAddress.value, 2, 2);
      this.findDistance();

      console.log('Setting the pickup form');

    } else {
      await this.util.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors!' : 'Korjaa lomakevirheet!');
    }
  }

  findDistance() {
    if (this.pickUpAddress.dirty) {
      // this.progress = true;
      // Distance matrix API
      //  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.pickupAddress.lat}, ${this.pickupAddress.lng}&destinations=${this.dropAddress.lat},${this.dropAddress.lng}&mode=driving&key=${AppConstants.API_KEY_MAP}`;

      // Directions matrix API

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.data.parcelDelPickLat.lat},${this.data.parcelDelPickLat.lng}&destination=${this.data.parcelDelDropLat.lat},${this.data.parcelDelDropLat.lng}&key=${AppConstants.API_KEY_MAP}`;
      // this.saveAddress(12, '12 KM');
      console.log('URL to be used', url);
      this.data.parcelDelOrder.pickupLat = this.data.parcelDelPickLat.lat;
      this.data.parcelDelOrder.pickupLng = this.data.parcelDelPickLat.lng;
      this.data.parcelDelOrder.dropLat = this.data.parcelDelDropLat.lat;
      this.data.parcelDelOrder.dropLng = this.data.parcelDelDropLat.lng;
      this.api.getDistance('GET', url).subscribe( data => {
        const result = JSON.parse(JSON.stringify(data));
        // this.progress = false;
        console.log('Address is ', result.status, result.result);
        if (result.status === 1) {
          const routes = JSON.parse(result.result).routes;
          console.log('Routes info', routes);
          console.log('Routes info', routes.length);
          if (routes.length > 0) {
            const distance = routes[0].legs[0].distance;
            const duration = routes[0].legs[0].duration;
            const distanceText = distance.text;
            const distanceValue = Math.round(((distance.value) / 1000));
            const durationText = duration.text;
            const durationValue = duration.value;
            this.saveAddress(distanceValue, distanceText);
            this.data.updateParcelDelDistance(distanceText, distanceValue, durationText, durationValue);
            console.log('this is distance', distanceText, distanceValue, durationText, durationValue)
            this.data.parcelDelTab = [false, false, false, false, true];
            this.data.parcelDelTabIndex = 2;
            this.data.parcelDelTabIndex = 3;
            this.data.timeReady = true;
          } else {
            this.presentToast(this.translation.getLang() === 'en' ? 'Looks like it is not possible to navigate.' : 'Näyttää siltä, että navigointi ei ole mahdollista.');
          }
        } else {
          this.presentToast(this.translation.getLang() === 'en' ? 'Your postcode or city is incorrect!' : 'Postinumero tai kaupunki on väärä!');
        }

      }, error => {
        console.log('Error is this', JSON.stringify(error));
        this.presentToast(this.translation.getLang() === 'en' ? 'Unable to validate your address' : 'Osoitettasi ei voida vahvistaa');
      })
    } else {
      this.saveAddress(this.data.order.distance, this.data.order.distance + ' KM');
      this.setAddress();
    }

  }

  saveAddress(distance, time) {
    console.log('this is saved in parcel del pickup', this.data.parcelDelOrder.pickup, this);
    this.data.parcelDelOrder.pickup.googleLoc = this.data.placeNamePickup;
    this.pickUpAddress.value.googleLoc = this.placeNamePickup;
    this.data.saveAddress(this.data.parcelDelOrder.pickup, this.pickUpAddress.value, distance, time);
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.data.updateForms.unsubscribe();
  }
}
