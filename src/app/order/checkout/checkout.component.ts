import { Component, OnInit } from '@angular/core';
import {DataShareService} from "../../services/data-share.service";
import {Coupon} from "../../models/Coupon";
import {UtilService} from "../../services/util.service";
import {AppConstants} from "../../AppConstants";
import {ApiService} from "../../services/api.service";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private allCoupons:  Coupon[];
  private discount: number;
  private couponProgress: boolean = false;
  public couponInput: string = '';
  token: any;
  placed: any;

  constructor(public translation: TranslationService, public alertController: AlertController, private router: Router, private session: SessionService, public data: DataShareService, public util: UtilService, private api: ApiService) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.loadStripe();
    // this.util.sendPageView('checkout', {
    //   user: this.session.getUser()._id,
    //   total:  this.orderType.total
    // }, true);
// TEST KEY IN CASE NEEDED - pk_test_HegC0gOK0W4yqSZARd2enGt2
  }

  save(){
    const order = this.data.getOrder();
   // order.payment = '';
    this.data.setOrder(order)
  }

  applyCoupon(coupon) {
    // this.couponProgress = true;
    this.api.getAllCoupons(coupon).subscribe(async data => {
      this.allCoupons = data;
      if (this.allCoupons.length > 0) {
        for ( const item of this.allCoupons) {
          if (item.name.toLowerCase() === coupon) {
            const validCoupon = item;
            this.data.getOrder().coupon = item.name.toUpperCase();
            console.log('couppn applied is more than subtotal************', validCoupon );

            if (validCoupon.type === 'percentage') {
              // if percentage discount is 100% bypass stripe and place order
              if (validCoupon.discount === 100) {
                this.discount = (this.data.getOrder().subtotal) * (validCoupon.discount / 100);
                this.data.couponApplied = true;
                this.data.flow === 1 ? (this.data.tabs = [true, true, true, false]) : (this.data.parcelDelTab = [true, true, true, true, false])
                this.data.getOrder().total = 0;
                this.data.skip = true;
                // this.couponProgress = false;
              } else {
                this.data.couponApplied = true;
                // calculate percentage then change total and subtotal
                const sub = (this.data.getOrder().subtotal) * (validCoupon.discount / 100);
                this.discount = sub;
                console.log('this is discount on subtotal after coupon applied', sub);
                console.log('this is old subtotal before coupon applied',  this.data.getOrder().subtotal);
                this.data.getOrder().subtotal =  this.data.getOrder().subtotal - sub;
                console.log('this is new subtotal after coupon applied',  this.data.getOrder().subtotal);
                this.data.loadDiscountedCharges(this.data.people, this.data.peopleCharge);
                this.data.getOrder().total =  this.data.getOrder().subtotal +  this.data.getOrder().total;
                this.data.couponApplied = true;
                this.data.flow === 1 ? (this.data.tabs = [true, true, true, false]) : (this.data.parcelDelTab = [true, true, true, true, false])

                // this.couponProgress = false;
              }
            } else {
              // if absolute coupon amount is more than subtotal or total
              if (validCoupon.discount >  this.data.getOrder().subtotal) {
                console.log('couppn applied is more than subtotal************');
                this.discount =  this.data.getOrder().subtotal;
                this.data.couponApplied = true;
                this.data.flow === 1 ? (this.data.tabs = [true, true, true, false]) : (this.data.parcelDelTab = [true, true, true, true, false])

                this.data.getOrder().total = 0;
                this.data.skip = true;
                this.couponProgress = false;
              } else {
                //    change total and subtotal amount based on absolute value
                this.data.couponApplied = true;
                this.data.flow === 1 ? (this.data.tabs = [true, true, true, false]) : (this.data.parcelDelTab = [true, true, true, true, false])

                this.data.getOrder().subtotal =  this.data.getOrder().subtotal - validCoupon.discount;
                this.discount = validCoupon.discount;
                this.data.loadDiscountedCharges(this.data.people, this.data.peopleCharge);
                this.data.getOrder().total =  this.data.getOrder().subtotal +  this.data.getOrder().total;
                this.couponProgress = false;
              }
            }
            return true;

          } else{
            this.couponProgress = false;

          }

        }
        this.couponProgress = false;
        await this.util.presentAlert(this.translation.getLang() === 'en' ? 'Coupon' : 'Kuponki', this.translation.getLang() === 'en' ? 'Please enter a valid coupon code' : '\n' +
            'Anna kelvollinen kuponkikoodi');

      } else {
        this.util.presentAlert(this.translation.getLang() === 'en' ? 'Invalid Coupon' : 'Virheellinen kuponki', this.translation
            .getLang() === 'en' ? 'Please enter a valid coupon code' : 'Anna kelvollinen kuponkikoodi');
        this.couponProgress = false;

      }

      console.log('this is coupon data', this.allCoupons);
    }, error => {
      console.log('an error occurred while getting coupons', error);
    });
  }

  removeCoupon() {
    const orderType =  this.data.flow === 1 ? this.data.order : this.data.parcelDelOrder

    orderType.total = this.data.initialAmount;
    orderType.subtotal = this.data.initialAmount;
    this.data.amountDel = this.data.initialAmount;
    this.data.loadCharges(this.data.people, this.data.peopleCharge);
    this.data.flow === 1 ? this.data.tabs = [false, false, false, false] : this.data.parcelDelTab = [false, false, false, false, false];

    this.data.couponApplied = false;
    this.data.couponInput = '';
    this.data.skip = false;
  }


  skipStripePlaceOrder() {
    if (this.session.isLoggedIn) {
      this.placeOrder('FREE');
    } else {
      this.presentAlertConfirm(1);
    }
  }


  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(s);
    }
  }

  startStripe() {
    // console.log('this is order details************',  this.orderType);
    const orderType =  this.data.flow === 1 ? this.data.order : this.data.parcelDelOrder
    if (this.session.isLoggedIn) {
      const handler = (window)['StripeCheckout'].configure({
        key: '',
        // key: '',
        email: this.session.getUser().email ,
        locale: 'auto',
        token: (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          console.log('this is token to be sent to server', token);
          this.token = token.id;
          this.placeOrder(this.token);
          this.placed = true;
          console.log(token);
        }
      });

      handler.open({
        currency: 'EUR',
        amount: Math.ceil(orderType * 100)
      });
    } else if (this.data.flow === 1){
      this.presentAlertConfirm(2);

    }else if (this.data.flow === 2){
      this.presentAlertConfirm(3);
    }
  }

  async presentAlertConfirm(type) {
    const alert = await this.alertController.create({
      cssClass: 'Please Login',
      header: this.translation.getLang() === 'en' ? 'Confirm!' : 'Vahvistaa!',
      message : this.translation.getLang() === 'en' ? 'Please login before payment' : 'Kirjaudu sisään ennen maksamista',
      buttons: [
        {
          text: this.translation.getLang() === 'en' ? 'Cancel' : 'Peru',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            if (type === 1) {
              this.router.navigate(['/auth/login'], {replaceUrl: true, queryParams: {home: true}});

            } else if (type === 2) {
              this.router.navigate(['/auth/login'], {replaceUrl: true, queryParams: {flow: 1}});
              this.data.tabIndex = 3;
            } else if (type === 3) {
              this.router.navigate(['/auth/login'], {replaceUrl: true, queryParams: {flow: 2}});
              this.data.parcelDelTabIndex = 4;
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async placeOrder(stripeToken) {
    const orderType =  this.data.getOrder();
    let sign = '';
    let receipt = '';

    if (this.data.flow === 2) {
      console.log('we are in place order 2nd flow')
      //upload parcel recipt and signature
      const parcelFormData = new FormData();
      parcelFormData.append('files', this.data.receiptImage, `file-${new Date().getTime()}.jpg`);
      console.log('this is receipt image', this.data.receiptImage);
      console.log('this is parcel form data', parcelFormData);
      try {
        const receiptResult =  await this.api.uploadImage(parcelFormData).toPromise();
        receipt = receiptResult[0].id;

      } catch (e) {
        console.log('an error occurred while uploading image', e);
        this.util.presentToast(this.translation.getLang() === 'en' ? 'An error occurred while placing order' : 'Tilausta tehtäessä tapahtui virhe');
      }
      const signFormData = new FormData();
      signFormData.append('files', this.data.signImage, `file-${new Date().getTime()}.jpg`);
      const signResult =  await this.api.uploadImage(signFormData).toPromise();
      sign = signResult[0].id;
      console.log('this is the order*****************', this.data.parcelDelOrder);
      console.log('this is the order#########', this.data.getOrder(), this.data.flow);
      console.log('@@@@@@@@@@@@@@@', this.data.order);
      console.log('this is the sign', sign);

    }

    const order = {
      date: this.data.getOrder().schedule.date,
      vehicle:  this.data.getOrder().schedule.vehicle.id,
      user: this.session.getUser()._id,
      items: this.data.flow === 1 ?  this.data.getItems() : [],
      sign: this.data.flow === 1 ? null : sign,
      type: this.data.flow === 1 ? '1' : '2',
      parcel: this.data.flow === 1 ? null : receipt,
      pickup:  orderType.pickup,
      post_service: this.data.flow === 1 ? '' : this.data.parcelDelOrder.pickup.post_service,
      packetId: this.data.flow === 1 ? '' : this.data.parcelDelOrder.pickup.packetId,
      drop:  orderType.drop,
      pickup_lat:  orderType.pickupLat,
      pickup_lng:  orderType.pickupLng,
      drop_lat:  orderType.dropLat,
      drop_lng:  orderType.dropLng,
      distance:  orderType.distance,
      total:  orderType.total,
      subtotal:  orderType.subtotal,
      charges:  orderType.charges,
      people:  orderType.people,
      status: 'PENDING',
      from:  this.data.flow === 1 ? this.data.order.schedule.from : this.data.parcelDelOrder.schedule.from,
      token: stripeToken,
      till:  this.data.flow === 1 ? this.data.order.schedule.till : this.data.parcelDelOrder.schedule.till,
      coupon:  orderType.coupon
    };

    console.log('Trying to send', AppConstants.API.ORDERS, 'With ' + JSON.stringify({headers: {Authorization: `Bearer ${AppConstants.token}`}}));
    console.log('Data is', JSON.stringify(order));
    console.log('This is the orders', order);
    this.api.createOrder(order).subscribe(result => {
      this.sendEmail(result);
      this.util.sendPageView('order', {
        user: this.session.getUser()._id,
        total: orderType.total
      }, true);
      this.router.navigateByUrl('/payment/payment-success');
      // this.util.presentAlert('Order Success','Hi your order is placed successfully! Your order id is #' + result.id);
    }, error => {
      console.error(error);
      this.util.presentAlert(this.translation.getLang() === 'en' ? 'Order Error' : 'Tilausvirhe',this.translation.getLang() === 'en' ? 'Hi, there is an error occurred while placing your order request, please contact support team. If issue persist.' : 'Hei, tilauspyyntöä tehtäessä tapahtui virhe. Ota yhteyttä tukitiimiin. Jos ongelma jatkuu.');
      this.data.resetAllData();
      this.router.navigateByUrl('/tabs/home')
    });
  }

    sendEmail(order) {
      const body = {
        to: order.user.email,
        name: order.user.name,
        subject: 'Order Received',
        type: 'customer',
        text: `Hi ${order.user.name}, \n This email is to inform you that we have received your order and we will keep you informed about your order. \n Thanks and Regards \n Team moovto`,
        html: `<p>Hi ${order.user.name},</p> <p>This email is to inform you that we have received your order and we will keep you informed about your order.</p><p>Thanks &amp; Regards</p><p>Team moovto</p>`
      };

      this.api.sendEmail(body).subscribe(res => console.log(res));
    }



  uploadImage(blobImage){
    const formData = new FormData();
    formData.append('files', blobImage, `file-${new Date().getTime()}.jpg`);
    this.api.uploadImage(formData).subscribe(result => {
      console.log('Image upload success!', result[0].id);
    }, error => {
      console.log('Err in uploading image!', error);
    });
  }
}
