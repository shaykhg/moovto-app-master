import {Component, OnInit} from '@angular/core';
import {DataShareService} from "../../../services/data-share.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {UtilService} from "../../../services/util.service";
import {AppConstants} from "../../../AppConstants";
import {TranslationService} from "../../../services/translation.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  public orders;

  constructor(private router: Router, public  translation:TranslationService, public util: UtilService, private api: ApiService, public dataShare: DataShareService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('Ion view did enter')
    const orderId = this.route.snapshot.paramMap.get('id');

    // Check if order id is valid and order in memory is not ok
    if (orderId && !this.dataShare.getOrder()) {
      // Get user details
      this.getOrderDetails(orderId);
    } else if (!this.dataShare.getOrder()){
      // if order id is not available, send Auser back to history
      this.router.navigate(['/tabs/history'], {replaceUrl: true});
    }
    this.getDetails(orderId)
  }

  /**
   * Get user details if not available in memory
   * @param orderId
   */
  async getOrderDetails(orderId: string) {
    await this.util.presentLoading('Loading order details...');
    try {
      // Found user details set it to service, so it can be used by UI
      this.dataShare.order = await this.api.getOrderDetails(orderId).toPromise();
    } catch (e) {
      // An error occurred go back to History and display an error
      console.log(e);
      await this.util.presentToast('An error occurred while loading order!');
      await this.router.navigate(['/tabs/history'], {replaceUrl: true});
    }
    await this.util.dismissLoading();
  }

  getDetails(orderId){
    this.api.getOrderDetails(orderId).subscribe(data=>{
      this.orders = data
      this.orders.signImage =  this.orders.sign ?  AppConstants.BASE_URL +  this.orders.sign.url: '';
      this.orders.parcelImage =  this.orders.parcel?  AppConstants.BASE_URL +  this.orders.parcel.url: '';
      // this.orders.forEach(el => {
      //
      // })
      console.log(this.orders)

    })
  }

    copy(id) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = id;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.util.presentToast(this.translation.getLang() === 'en' ? 'Order id copied succesfully' : 'Tilaustunnus kopioitiin onnistuneesti');
    }
}
