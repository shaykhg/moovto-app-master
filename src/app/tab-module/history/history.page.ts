import { Component, OnInit } from '@angular/core';
import {AppConstants} from '../../AppConstants';
import {ApiService} from "../../services/api.service";
import {DataShareService} from "../../services/data-share.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  public setOrders
  public id=''

  constructor(public util: UtilService,public  translation:TranslationService, private api:ApiService, private dataShare:DataShareService, private router:Router) { }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.setOrder()
    console.log('we are in history component')
  }

  setOrder(){
    this.util.presentLoading('Loading order history...');
    this.api.getOrders().subscribe(data=>{
      this.util.dismissLoading();
      this.setOrders = data.reverse();
      this.setOrders.forEach(el => {
        el.createdAt = moment(el.createdAt).toDate();
      })
      // const sortedArr = _.sortBy(this.setOrders, function(dateObj) {
      //   return  moment(dateObj.createdAt);
      // });
      // const sorted = _.orderBy(this.setOrders, ['createdAt'],['desc'])

      // console.log(sorted)
    },error => {
      this.util.dismissLoading();
      console.log(error);
      this.util.presentToast(this.translation.getLang() === 'en' ? 'An error occurred while loading order history!' : 'Tilaushistoriaa ladattaessa tapahtui virhe!');
    })
  }
  //


  /**
   * Open order details : Set Order and move to details page
   * @param order
   */
  openDetails(order) {
    this.dataShare.setOrder(order);
    console.log('Clicking here');
    this.router.navigateByUrl('/tabs/history/order-details/' + order.id)
  }
}
