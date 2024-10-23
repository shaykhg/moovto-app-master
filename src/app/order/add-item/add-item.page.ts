import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {element} from "protractor";
import {AppConstants} from "../../AppConstants";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  deliveryData = []
  inputNum: number;
  getInput: number;
  weightType = 'kg';
  getWeight: any

  deliveryForm = this._formBuilder.group({
    quantity: ['', Validators.required,],
    weight: ['', Validators.required,],
    height: ['', Validators.required,],
    width: ['', Validators.required, ],
    length: ['', Validators.required, ],
    description: ['', Validators.required],
  })
  type: string = '';
  public subCategories: any[] = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2.3,
    pagination: false,
    spaceBetween: 22

  };
  private formData: any;
  private selectedItem: any;
  constructor(private api: ApiService, public modalController: ModalController, public data: DataShareService,private _formBuilder:FormBuilder, public translation: TranslationService) { }

  ngOnInit() {
    this.getSubcategories();
  }

  onSubmit() {
    console.log('this is delivery form value', this.deliveryForm.value);
    this.formData = this.deliveryForm.value;
    this.formData.name = this.type;
    this.formData.charge = this.selectedItem.charges * this.formData.quantity;
    console.log('this is form value', this.deliveryForm.value);
    this.formData.weightType = 'kg'

    this.deliveryData.push(this.deliveryForm.value);
    this.data.setItems(this.formData);
    this.data.tabs = [false, true, true, true]
    setTimeout(()=> {
      this.modalController.dismiss();

    });
    console.log('***********',  this.deliveryData)
  }

  plus() {
    this.inputNum = this.inputNum ? this.inputNum + 1 : this.inputNum = 1;
  }

  minus() {
    if (this.inputNum > 1) {
      this.inputNum = this.inputNum - 1;
    }
  }

  getSubcategories() {
    this.api.getSubCategories().subscribe( data => {
      this.subCategories = data;
      // this.selectItem(this.subCategories[0])
     // this.type = this.subCategories[0].name
      this.subCategories.forEach( el => {
        el.selected = false;
       el.icon ?  (el.icon = AppConstants.BASE_URL + el.icon.url) : undefined;
      })
      console.log('this is all subacategories', this.subCategories );

    }, error => {
      console.log('error occurred in getting subcategories', error );
    })
  }

  selectItem(subCat) {
    console.log('this is subcat', subCat);
    this.selectedItem = subCat;

    this.type = subCat.name;
    this.deliveryForm.value.charge = subCat.charges;
  }
}
