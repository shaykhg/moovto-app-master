import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {UtilService} from "../../services/util.service";
import {ApiService} from "../../services/api.service";
import {AppConstants} from "../../AppConstants";
import {ToastController} from "@ionic/angular";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-delivery-location',
  templateUrl: './delivery-location.component.html',
  styleUrls: ['./delivery-location.component.scss'],
})
export class DeliveryLocationComponent implements OnInit {

  isLinear = false;
  secondFormGroup: FormGroup;
  setWeight: any
  placeNamePickup = '';
  getWidth: any
  getLength:any
  placeNameDrop = '';
  public resultsPick = [];
  public resultsDrop = [];

  pickupForm = this._formBuilder.group({
    building: ['', Validators.required],
    doorCode: [''],
    // street: ['', Validators.required],
    city: ['', Validators.required],
    postCode: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    noteForRider: [''],
  })

  dropUpForm = this._formBuilder.group({
    building: ['', Validators.required],
    doorCode: [''],
    // street: ['', Validators.required],
    city: ['', Validators.required],
    postCode: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    noteForRider: [''],
  })
  private searchTerm: any;
  private dropAddress: any;
  private pickupAddress: any;
  private measurement = 'cm'


  constructor(private toast: ToastController,public translation:TranslationService, public util: UtilService, private api: ApiService, private _formBuilder: FormBuilder, public data: DataShareService,private placePredictionService: PlacePredictionService,private change: ChangeDetectorRef,private utils:UtilService) {
  }
  ngOnInit() {
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    setTimeout(() => {
      this.loadAddress();
    }, 150);

  }


  async loadAddress(){
    if (this.data.order){
      if (this.data.order.pickup){
        console.log('this is pickup location data', this.data.order.pickup);
        this.pickupForm.patchValue(this.data.order.pickup);
        this.placeNamePickup = this.data.order.pickup.googleLoc;
      }
      if (this.data.order.drop){
        console.log('this is drop location data', this.data.order.pickup);
        this.dropUpForm.patchValue(this.data.order.drop);
        this.placeNameDrop = this.data.order.drop.googleLoc;
      }
    }
  }


  handleSearch(term, type) {
    this.searchTerm = term;
    if (this.searchTerm === '') {
      return;
    } else {
      if (type === 1) {
        this.resultsPick = [];
        this.placePredictionService.getPlacePredictions(term).subscribe(data => {
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

  async setPickUpAddress(address) {
    console.log('this is addresss***********', address);
    this.placeNamePickup = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {
      console.log(data);
      this.pickupForm.controls.postCode.markAsDirty();
      this.pickupForm.controls.postCode.setValue(data.postCode);
      this.pickupForm.controls.city.setValue(data.city);
      // this.pickupForm.controls.street.setValue(data.street);
      this.pickupForm.controls.postCode.setValue(data.postal);
      this.pickupAddress = data;
      this.utils.savePickup(data);
      this.pickupForm.enable();
      this.resultsPick = [];
      this.change.detectChanges();
      this.data.tabs = [false, false, true, true];
    }, error => {
      console.log(error);
    });
  }


  async setDropAddress(address) {
    this.placeNameDrop = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {
      console.log('this is the place data', data)
      this.dropUpForm.controls.city.setValue(data.city);
      // this.dropUpForm.controls.street.setValue(data.street);
      this.dropUpForm.controls.postCode.setValue(data.postal);
      this.dropAddress = data;
      this.util.saveDrop(data);
      this.dropUpForm.enable();
      this.dropUpForm.markAllAsTouched();
      this.resultsDrop = [];
      this.change.detectChanges();
      this.data.tabs = [false, false, true, true];

    }, error => {
      console.log(error);
    });
  }


  async setAddress() {
    if (this.pickupForm.valid && this.dropUpForm.valid){
      console.log('Setting the pickup form');
      await this.data.setAddress(this.pickupForm.value, 1, 1);
      await this.data.setAddress(this.dropUpForm.value, 2, 1);
      this.data.tabs[2] = false;
      this.data.tabIndex = 2;
      this.data.timeReady = true;
    } else {
      await this.utils.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors!' : 'Korjaa lomakevirheet!');
    }
  }

  findDistance() {
    console.log('this is order before finding distance ' + this.data.getOrder() + ' Flow is '+ this.data.flow);
    console.log('tis is pickup address', this.pickupAddress);
    console.log('tis is drop address', this.dropAddress);
        if (this.pickupForm.valid || this.dropUpForm.valid) {
          this.pickupAddress = this.pickupAddress ? this.pickupAddress : this.data.getOrder().pickup;
          this.dropAddress = this.dropAddress ? this.dropAddress : this.data.getOrder().drop;
          console.log('this form is dirt');
          const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.pickupAddress.lat},${this.pickupAddress.lng}&destination=${this.dropAddress.lat},${this.dropAddress.lng}&key=${AppConstants.API_KEY_MAP}`;
          // this.saveAddress(12, '12 KM');
          console.log('URL to be used', url);
          this.data.order.pickupLat = this.pickupAddress.lat;
          this.data.order.pickupLng = this.pickupAddress.lng;
          this.data.order.dropLat = this.dropAddress.lat;
          this.data.order.dropLng = this.dropAddress.lng;

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
                this.data.updateDistance(distanceText, distanceValue, durationText, durationValue);
                this.setAddress();
                console.log('this is total distance values*****************************', distanceText, distanceValue);
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
          // console.log('this form is not dirty');
          //
          // this.saveAddress(this.data.order.distance, this.data.order.distance + ' KM');
          // this.setAddress();
          this.util.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors' : 'Korjaa lomakevirheet');
        }

  }

  saveAddress(distance, time) {
    this.pickupForm.value.googleLoc = this.placeNamePickup;
    this.dropUpForm.value.googleLoc = this.placeNameDrop;
    this.data.saveAddress(this.pickupForm.value, this.dropUpForm.value, distance, time);
    console.log('this is order afyer saving address', this.data.getOrder());
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
