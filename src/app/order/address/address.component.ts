import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UtilService} from "../../services/util.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {SignatureComponent} from "../signature/signature.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslationService} from "../../services/translation.service";
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  public resultsPick = [];
  public resultsDrop = [];
  myDialog;
  pickUpAddress= this.formBuilder.group({
    building: ['', [Validators.required]],
    // street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postCode: ['', [Validators.required, ]],
    packetId: ['', [Validators.required, ]],
    name: ['', [Validators.required, ]],
    phone: ['', [Validators.required, ]],
  });

 public searchTerm: any;
 public placeNamePickup: any;
  private pickUpAddressData: any;
  postOffice = '';
  public saved: boolean = false;

  constructor(private util: UtilService,public translation:TranslationService,public dialog: MatDialog, private formBuilder:FormBuilder, public data: DataShareService,private placePredictionService: PlacePredictionService,private change: ChangeDetectorRef) { }

  ngOnInit() {

    setTimeout(() => {
      this.loadAddress();
    }, 150);
  }


  async loadAddress(){
    if (this.data.parcelDelOrder){
      if (this.data.parcelDelOrder.pickup){
        console.log('this is pickup location data', this.data.parcelDelOrder.pickup);
        this.pickUpAddress.patchValue(this.data.parcelDelOrder.pickup);
        this.placeNamePickup = this.data.parcelDelOrder.pickup.googleLoc;
      }
    }
  }

 async  pickupSubmit(){
    if (this.pickUpAddress.valid && this.postOffice !== '') {
      const postcodes = ['01720', '13500', '13100', '00390', '00410', '00420', '00120', '01700'];
      if (!postcodes.includes(this.pickUpAddress.value.postCode)){
        await this.util.presentAlert(this.translation.getLang() === 'en' ? 'Service Unavailable': 'palvelu ei saatavilla', this.translation.getLang() === 'en' ? 'Sorry we currently don’t deliver at your postcode. But keep looking, we are expanding fast 😃' : 'Pahoittelut emme tällä hetkellä kuljeta valitsemaasi postiosoitteeseen, mutta laajennamme toimitusalueitamme jatkuvasti. 😃');
        return;
      } else {

      }
      const order = {
        building: this.pickUpAddress.value.building,
        doorCode: this.pickUpAddress.value.doorCode,
        // street: this.pickUpAddress.value.street,
        city: this.pickUpAddress.value.city,
        postCode: this.pickUpAddress.value.postCode,
        name: this.pickUpAddress.value.name,
        phone: this.pickUpAddress.value.phone,
        post_service: this.postOffice,
        packetId: this.pickUpAddress.value.packetId
      }
      this.setAddress(order);
      console.log('form is valid');
      // this.util.setPage(2);

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'Please Enter Valid Information' : 'Anna kelvolliset tiedot', 'Ok')
    }
  }

  handleSearch(term, type) {
    this.searchTerm = term;
    console.log('this is search term', term, type);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(SignatureComponent, {
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.myDialog = result;
      if (result === 1) {
        this.util.presentToast(this.translation.getLang() === 'en' ? 'Signature saved successfully' : 'Allekirjoitus tallennettu');
        this.saved = true;
      }
    });
  }


  async setPickUpAddress(address) {
    console.log('this is addresss***********', address);
    this.data.placeNamePickup = address.description;
    this.placeNamePickup = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {
      this.pickUpAddress.controls.postCode.markAsDirty();
      this.pickUpAddress.controls.postCode.setValue(data.postCode);
      this.pickUpAddress.controls.city.setValue(data.city);
      // this.pickUpAddress.controls.street.setValue(data.street);
      this.pickUpAddress.controls.postCode.setValue(data.postal);
      console.log('this is data', data);

      this.pickUpAddressData = data;
      this.util.savePickup(data);
      this.data.parcelDelPickLat = data;

      // this.pickUpAddress.enable();
      this.resultsPick = [];
      this.change.detectChanges();
      this.data.parcelDelTab = [false, false, true, true, true];
    }, error => {
      console.log(error);
    });
  }


onClickedOutside($event: Event) {
  this.resultsPick = [];
  this.resultsDrop = [];
}


  async setAddress(order) {
    if (this.pickUpAddress.valid){
      await this.data.setAddress(order, 1, 2);
      this.data.parcelDelTab[2] = false;
      this.data.parcelDelTabIndex = 1;
      this.data.parcelDelTabIndex = 2;
      this.data.updateForms.next(this.pickUpAddress.value);
      console.log('Setting the pickup form', this.pickUpAddress.value);

    } else {
      await this.util.presentToast(this.translation.getLang() === 'en' ? 'Please correct form errors!' : 'Korjaa lomakevirheet!');
    }
  }


}
