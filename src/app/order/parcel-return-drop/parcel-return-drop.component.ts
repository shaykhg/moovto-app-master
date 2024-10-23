import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-parcel-return-drop',
  templateUrl: './parcel-return-drop.component.html',
  styleUrls: ['./parcel-return-drop.component.scss'],
})
export class ParcelReturnDropComponent implements OnInit {

  searchTerm;
  public resultsPick = [];
  public resultsDrop = [];
  dropAddress;
  placeNameDrop = '';
  dropForm = this.formBuilder.group({
    dropBuilding: ['', [Validators.required]],
    dropStreet: ['', [Validators.required]],
    dropPostCode: ['', [Validators.required, Validators.maxLength(6)]],
    dropName: ['', [Validators.required, Validators.maxLength(10)]],
    dropPhone: ['', [Validators.required, Validators.maxLength(10)]]
  });

  constructor(private data: DataShareService,public translation:TranslationService, private formBuilder: FormBuilder, private api: ApiService, private util: UtilService,private placePredictionService: PlacePredictionService, private change: ChangeDetectorRef) {
  }
  ngOnInit() {}

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

  dropOff() {
    if (this.dropForm.valid) {
      const order = {
        dropBuilding: this.dropForm.value.dropBuilding,
        dropStreet: this.dropForm.value.dropStreet,
        dropPostCode: this.dropForm.value.dropPostCode,
        dropName: this.dropForm.value.dropName,
        dropPhone: this.dropForm.value.dropPhone
      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'All Fields Are Mandatory' : 'Kaikki kentät ovat pakollisia', 'Ok')
    }
  }

  async setDropAddress(address) {
    this.placeNameDrop = address.description;
    this.placePredictionService.getDetails(address.place_id).subscribe(data => {

      this.dropForm.patchValue({
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
      this.dropForm.enable();
      // this.dropForm.markAllAsTouched();
      // this.dropForm.markAllAsTouched();
    }, error => {
      console.log(error);
    });
  }

}
