import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {AddItemPage} from "../add-item/add-item.page";
import {AddressComponent} from "../address/address.component";
import {ModalController} from "@ionic/angular";
import * as _ from 'lodash'
@Component({
  selector: 'app-shipment-pickup',
  templateUrl: './shipment-pickup.component.html',
  styleUrls: ['./shipment-pickup.component.scss'],
})
export class ShipmentPickupComponent implements OnInit {

  deliveryData = []
  inputNum: number;
  getInput: number;
  weightType = 'kg';
  getWeight: any;
  orders = [];

  deliveryForm = this._formBuilder.group({
    quantity: ['', Validators.required,],
    weight: ['', Validators.required,],
    width: ['', Validators.required, ],
    length: ['', Validators.required, ],
    description: ['', Validators.required],
  })

  constructor(public modalController: ModalController, public data: DataShareService,private _formBuilder:FormBuilder) { }

  ngOnInit() {
   setTimeout(() => {
     this.init();
   }, 1000);
  }

  async init(){
    console.log('init is called here in shipment pick up', this.data.getItems());
    if (this.data.getItems().length === 0){
      console.log('Modal should open');
      await this.presentModal();
    }
  }

  onSubmit() {
    const formData = this.deliveryForm.value;
    formData.weightType = this.weightType;

    // this.deliveryData.push({formData});
    this.deliveryData.push({
      quantity: this.deliveryForm.get('quantity').value,
      weight: this.deliveryForm.get('weight').value,
      width: this.deliveryForm.get('width').value,
      length: this.deliveryForm.get('length').value,
      description: this.deliveryForm.get('description').value,
      weightType: this.weightType
    })
    this.data.setOrder(this.deliveryData)
    // console.log( this.deliveryData)
  }
  plus() {

    this.inputNum = this.inputNum + 1;
  }

  minus() {
    if (this.inputNum > 1) {
      this.inputNum = this.inputNum - 1;
    }
  }

  getKgCss() {
    return this.weightType === 'kg' ? 'btnBorder' : '';
  }

  getKg() {
    this.weightType = 'kg';

  }

  async presentModal() {
    this.data.flow = 1;
    const modal = await this.modalController.create({
      component: AddItemPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  removeItems(item: any) {

    let items = this.data.getItems();

    _.remove(items, item);
    // console.log('this is the items after removal', items);
     if (items.length === 0) {
       this.data.updateItems(items);
       this.data.tabs = [false, true, true, true];
       this.presentModal();
     } else {
       this.data.updateItems(items);
       this.data.tabs = [false, true, true, true];

     }
  }

  goToSchedulePick() {
    // console.log('This is order when flow is 1 moved from 1st to second', this.data.getOrder())
    if (this.data.getItems().length > 0) {
      this.data.tabIndex = 1
      this.data.tabs = [false, false, true, true];
    } else {

    }
  }
}
