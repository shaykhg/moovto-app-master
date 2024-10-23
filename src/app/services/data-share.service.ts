import {Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {ApiService} from "./api.service";
import * as _ from 'lodash';
import {BehaviorSubject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
/**
 * This service allows sharing data between components.
 */
export class DataShareService {
  // ORDER = {
  //   items: [],
  //   pickup: undefined,
  //   drop: undefined,
  //   date: undefined,
  //   from: undefined,
  //   till: undefined,
  //   vehicle: undefined,
  //   vehicleCharge: 0,
  //   distance: 0,
  //   pickupLat: 0,
  //   pickupLng: 0,
  //   dropLat: 0,
  //   dropLng: 0,
  //   time: undefined,
  //   charges: [],
  //   people: 1,
  //   total: 0,
  //   subtotal: 0
  // };

  public order: any;
  public parcelDelOrder: any;
  public items = [];
  public location = [];
  public tabs = [false, true, true, true]
  public parcelDelTab = [false, true, true, true, true]
  public parcelReturnTab = [false, true, true, true]
  tabIndex = 0;
  parcelDelTabIndex = 0;
  private distance: any;
  private coupon: any;
  couponApplied: boolean;
  skip: boolean = false;
  initialAmount;
  peopleCharge = 1;
  people = '1';
  amountDel;
  private parcelDelItems = [];
  flow: number = 0;
  orderType;
  receiptImage;
  signImage: Blob =  null;
  parcelDelDropLat: any;
  timeReady = false;
  parcelDelPickLat: any;
  vehicle: any;
  peopleData: any;
  updateForms = new BehaviorSubject({});
  public vehicleCharge = 0;
  placeNamePickup = '';
  couponInput = '';

  constructor(private local: LocalStorageService, private api: ApiService) {
    console.log('these are items in data service init', this.items);
    this.init();
  }

  async init() {
    console.log('Init called!', this.flow);
    // this.local.removeItem('order');
    this.flow = await this.local.getNumber('flow');
    if (this.flow === 1){
      // const order = await this.local.getObject('order');
      // if (order) {
      //   console.log('isme aya')
      //   console.log('Order', order);
      //   this.order = order;
      //   this.items = this.order.items ? this.order.items : [];
      //   console.log('these are items*********', this.items);
      //   this.order.schedule = this.order.schedule || {date: undefined, from: '', till: '', vehicle: ''}
      // }

      const order = {};
      if (order) {
        this.order = order;
        this.items = this.order.items ? this.order.items : [];
        this.order.schedule = this.order.schedule || {date: undefined, from: '', till: '', vehicle: ''}
      }
    } else if (this.flow === 2){
      // const parcelDelOrder = await this.local.getObject('parcelDelOrder');
      // if (parcelDelOrder) {
      //   console.log('parcelDelOrder  me aya')
      //   console.log('parcelDelOrder', parcelDelOrder);
      //   this.parcelDelOrder = parcelDelOrder;
      //   this.parcelDelItems = this.parcelDelOrder.items ? this.parcelDelOrder.items : [];
      //   console.log('these are items*********', this.items);
      //   this.parcelDelOrder.schedule = this.parcelDelOrder.schedule || {date: undefined, from: '', till: '', vehicle: ''}
      // }
      console.log('in Second flow');
      this.parcelDelItems = [];
      this.parcelDelOrder = this.parcelDelOrder || {};
      this.parcelDelOrder.schedule = this.parcelDelOrder.schedule || {date: undefined, from: '', till: '', vehicle: ''};
      this.parcelDelTab = [false, true, true, true, true];
    } else if (this.flow === 3){

    } else {
      console.log('Unknown Flow!');
      this.tabs = [false, true, true, true];
      this.parcelDelTab = [false, true, true, true, true];
      this.parcelReturnTab = [false, true, true, true];
    }
    console.log(this.order, this.parcelDelOrder);
    // this.local.clear();
  }

  public setOrder(order) {
    // this.local.setObject('order', order);
  }

  public getOrder() {
    // console.log('this is order', this.order)
    return this.flow === 1 ?  this.order : this.parcelDelOrder;
  }

  public async setFlow(flow) {
    this.flow = flow;
  await this.local.setNumber('flow', this.flow);

  }

  setVehicleCharges(charge){
    const order = this.getOrder();
    order.vehicleCharge = charge;
    this.vehicleCharge = charge;
    console.log('this is vehicle charge', charge);
    if (this.flow === 1){
      this.order = order;
    } else if (this.flow === 2){
      this.parcelDelOrder = order;
    }
  }

  public async setItems(item) {
    // item.charge = 10.00;
   await this.items.push(item);
    console.log('Order', this.order, this.items);

    if (this.order && this.order.length === 0) {
      this.order = {};
    } else {
      this.order = this.order || {};
      this.order.items = this.items;
      console.log('this is local item', this.order, this.items);
      await this.local.setObject('order', this.order);
      console.log('this is local item', this.getOrder());
    }

  }

  public async setDelvItems(item) {
    // item.charge = 10.00;
    this.parcelDelItems.push(item);
    console.log('Order', this.getOrder());

    if (this.parcelDelOrder && this.parcelDelOrder.length === 0) {
      this.order = {};
    }
    this.parcelDelOrder = this.parcelDelOrder || {};
    this.parcelDelOrder.items = this.parcelDelItems;
    console.log('this is local item', this.parcelDelOrder);
    await this.local.setObject('parcelDelOrder', this.parcelDelOrder);
    console.log('this is local item', await this.local.getObject('parcelDelOrder'));
  }

  async setItemInParcelDel(key, item) {
    this.parcelDelOrder = this.parcelDelOrder || {};
    this.parcelDelOrder[key] = item;
    await this.local.setObject('parcelDelOrder', this.parcelDelOrder);
  }


  public async updateItems(items) {
    console.log('these are items in data service', this.items);
    console.log('Order', this.order, this.items);
    this.items = items;
    this.order = this.order || {};
    this.order.items = this.items;
    await this.local.setObject('order', this.order);
  }

  public async updateCoupon(coupon) {
    console.log('these are items in data service', this.items);
    console.log('Order', this.order, this.items);
    this.coupon = coupon;
    this.order = this.order || {};
    this.order.coupon = this.items;
    await this.local.setObject('order', this.order);
  }

  public async updateDistance(distanceText, distanceValue, durationText, durationValue) {
    this.distance = distanceValue;
    this.order = this.order || {};
    this.order.distance = this.distance;
    this.order.distance = this.distance;
    this.order.distanceText = durationText;
    this.order.durationText = durationText;
    this.order.durationValue = durationValue;
    await this.local.setObject('order', this.order);
  }

  public async updateParcelDelDistance(distanceText, distanceValue, durationText, durationValue) {
    this.distance = distanceValue;
    this.parcelDelOrder = this.parcelDelOrder || {};
    this.parcelDelOrder.distance = this.distance;
    this.parcelDelOrder.distance = this.distance;
    this.parcelDelOrder.distanceText = durationText;
    this.parcelDelOrder.durationText = durationText;
    this.parcelDelOrder.durationValue = durationValue;
    await this.local.setObject('order', this.parcelDelOrder);
  }

  public async setTimeInfo(schedule) {
    console.log('SetTimeINfor', schedule);
    this.getOrder().schedule = schedule;
    // this.order.schedule = schedule;
    await this.local.setObject(this.flow === 1 ? 'order': 'parcelDelOrder', this.getOrder());
  }

  public async setAddress(address, type, flow) {
    if (type === 1 && flow === 1) {
      this.order.pickup = address;
    } else if (type === 2 && flow === 1) {
      this.order.drop = address;
    } else if (type === 1 && flow === 2) {
      console.log('I am here');
      this.parcelDelOrder = this.parcelDelOrder ? this.parcelDelOrder: {};
      this.parcelDelOrder.pickup = address;
      console.log('this is parcel del order in setAddrss in data share', this.parcelDelOrder)
    } else if (type === 2 && flow === 2) {
      this.parcelDelOrder.drop = address;
      console.log('this is parcel del order in setAddrss in data share pickup', this.parcelDelOrder)

    }
    await this.local.setObject('order', this.order);
    await this.local.setObject('parcelDelOrder', this.parcelDelOrder);
  }

  public getItems() {
    return this.flow === 1 ? this.items : this.parcelDelItems;
  }

  async saveCharges(charge) {
    console.log('this is charge in saveCharge function in data share', charge);
    this.initialAmount = charge;
    this.amountDel = charge;
    this.getOrder().subtotal = charge;
    this.getOrder().total = charge;
    console.log('this is After saving charge++++++++++++++', this.getOrder());
    await this.local.setObject(this.flow === 1 ? 'order' : 'parcelDelOrder', this.getOrder());
    // this.loadCharges(false, false);
  }

  loadCharges(peopleLabel, peopleValue) {
    this.api.getExtraCharges().subscribe(
        data => {
          console.log('Extra Charges ', data);
          const charges = JSON.parse(JSON.stringify(data));
          this.getOrder().charges = [];
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < charges.length; i++) {
            const item = charges[i];
            console.log('Type', item);
            if (item.type === 'charge') {
              if (item.charge_type === 'amount') {
                this.getOrder().total = Math.round((this.getOrder().total + item.amount) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title + ` (€${item.amount})`,
                  value: Math.round(item.amount * 100) / 100,
                });

              } else if (item.charge_type === 'percentage') {
                let charge = (item.amount * this.getOrder().subtotal) / 100;
                charge = Math.round(charge * 100) / 100;
                this.getOrder().total = Math.round((this.getOrder().total + charge) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title + ` (${item.amount}%)`,
                  value: Math.round(charge * 100) / 100
                });

              }

            } else if (item.type === 'discount') {

              if (item.charge_type === 'amount') {

                this.getOrder().total = Math.round((this.getOrder().total - item.amount) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title,
                  value: Math.round(item.amount * 100) / 100
                });

              } else if (item.charge_type === 'percentage') {
                const charge = (this.getOrder().subtotal * item.amount) / 100;
                this.getOrder().total = Math.round((this.getOrder().total - charge) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title,
                  value: Math.round(charge * 100) / 100
                });
              }
            }
          }

          if (peopleValue) {
            const chargeItem = peopleValue;
            console.log('Adding people charge', chargeItem, this.getOrder().total, this.getOrder().subtotal);
            this.getOrder().total = this.getOrder().total + chargeItem;
            this.getOrder().charges.push({
              title: `Person Charges (${peopleLabel})`,
              value: chargeItem
            });

            // this.storage.set('order', this.ORDER);
          }
        });
  }

  loadDiscountedCharges(peopleLabel, peopleValue) {
    this.api.getExtraCharges().subscribe(
        data => {
          console.log('Extra Charges ', data);
          const charges = JSON.parse(JSON.stringify(data));
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < charges.length; i++) {
            const item = charges[i];
            console.log('Type', item);
            if (item.type === 'charge') {
              if (item.charge_type === 'amount') {
                this.getOrder().total = Math.round((this.getOrder().total + item.amount) * 100) / 100;
              } else if (item.charge_type === 'percentage') {
                let charge = (item.amount * (this.getOrder().subtotal)) / 100;
                charge = Math.round(charge * 100) / 100;
                this.getOrder().total = Math.round((this.getOrder().subtotal + charge) * 100) / 100;
                _.remove(this.getOrder().charges, {title:  item.title + ` (${item.amount}%)`});
                this.getOrder().charges.push({
                  title: item.title + ` (${item.amount}%)`,
                  value: Math.round(charge * 100) / 100
                });
              }

            }else if (item.type === 'discount') {

              if (item.charge_type === 'amount') {

                this.getOrder().total = Math.round((this.getOrder().total - item.amount) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title,
                  value: Math.round(item.amount * 100) / 100
                });

              } else if (item.charge_type === 'percentage') {
                const charge = (this.getOrder().subtotal * item.amount) / 100;
                this.getOrder().total = Math.round((this.getOrder().total - charge) * 100) / 100;
                this.getOrder().charges.push({
                  title: item.title,
                  value: Math.round(charge * 100) / 100
                });
              }
            }
          }
          if (peopleValue) {
            const chargeItem = peopleValue;
            console.log('Adding people charge', chargeItem, this.getOrder().total, this.getOrder().subtotal);
            this.getOrder().total = this.getOrder().total + chargeItem;
            // this.getOrder().charges.push({
            //   title: `Person Charges (${peopleLabel})`,
            //   value: chargeItem
            // });

            // this.storage.set('order', this.ORDER);
          }
        });
  }


  savePeopleCharge(label, value) {
    this.loadCharges(label, value);
  }

  async saveDelivery(date, from, till, vehicle, people) {
    console.log('this is date rom and till', date, from, till, vehicle, people);
    // const orderType = this.flow === 1 ? this.order : this.parcelDelOrder

    this.getOrder().date  = date;
    this.getOrder().from = from;
    this.getOrder().till  = till;
    this.getOrder().vehicle = vehicle;
    this.getOrder().people  = people;
     console.log('this is order in save delivery Function ++++++++++++', this.getOrder());
  }


  findCoordinates(address, type) {
    const order = this.getOrder();
    console.log(order);
    this.api.getCoordinates(address).subscribe(
        data => {
          console.log('Address LAT ', type, data);
          const result = JSON.parse(JSON.stringify(data));
          const location = result.results[0].geometry.location;
          if (type === 1) {
            order.pickupLat = location.lat;
            order.pickupLng = location.lng;
            this.local.setObject(this.flow === 1 ? 'order' : 'parcelDelOrder', order);
          } else if (type === 2) {
            order.dropLat = location.lat;
            order.dropLng = location.lng;
            this.local.setObject(this.flow === 1 ? 'order' : 'parcelDelOrder', order);
          }
        }, error => {
          console.log(error);
        });
  }

  saveAddress(pickup, dropForm, distance, time) {
    console.log('this is saved pickup @@@@@@@@@', this.order, pickup);
    let orderType = this.getOrder();
    if (!orderType){
      orderType = {};
    }
    orderType.pickup = pickup;
    orderType.drop = dropForm;
    orderType.distance = distance;
    orderType.time = time;
    this.local.setObject(this.flow === 1 ? 'order' : 'parcelDelOrder', orderType);
    // console.log('Address Saved', this.ORDER);
    // this.findCoordinates(pickup.street + ', ' + pickup.postcode + ', ' + pickup.city + ', Finland', 1);
   //  this.findCoordinates(dropForm.street + ', ' + dropForm.postcode + ', ' + dropForm.city + ', Finland', 2);
  }

  async resetAllData() {
    console.log('resetting data start')
    this.order = undefined;
    this.parcelDelOrder = undefined;
    this.couponInput = '';
    this.items = [];
    this.location = [];
    this.tabs = [false, true, true, true]
    this.parcelDelTab = [false, true, true, true]
    this.tabIndex = 0;
    this.parcelDelTabIndex = 0;
    this.distance = undefined;
    this.coupon = undefined;
    this.couponApplied = false;
    this.skip = false;
    this.initialAmount = undefined;
    this.peopleCharge = 1;
    this.people = '1';
    this.amountDel =  undefined;
    this.parcelDelItems = [];
    this.flow =  0;
    this.orderType = undefined;
    this.receiptImage = undefined;
    this.signImage =  undefined;
    this.parcelDelDropLat = undefined;
    this.parcelDelPickLat = undefined;
   await this.local.removeObject('order');
   await this.local.removeObject('parcelDelOrder');
   await this.local.removeObject('flow');
   await this.local.setBoolean('first', true);

    console.log('resetting data end')

  }

}
