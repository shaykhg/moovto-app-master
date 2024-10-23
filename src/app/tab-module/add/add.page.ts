import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {ActivatedRoute} from "@angular/router";
import {not} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  public notification = [];

  constructor(private api:ApiService, private util:UtilService,private route:ActivatedRoute) { }

  ngOnInit() {
  }


  ionViewDidEnter() {
    console.log('we are in history component')
    this.getNotify();
  }

  async getNotify(){
    await this.util.presentLoading();
    this.api.getNotification().subscribe(async data=>{
      this.notification = data.reverse()
      console.log(this.notification)
      await this.util.dismissLoading();

      for(const notify of this.notification){
        if(notify.type=='1'){
          notify.img='assets/notification/fast-delivery.png'
        }
        else if(notify.type=='2'){
          notify.img='assets/notification/cancel.png'
        }

        else if(notify.type=='3'){
          notify.img='assets/notification/tag.png'
        }
      }

    },async error => {
      console.log(error.message)
      await this.util.dismissLoading();
      await this.util.presentToast(error.message);
    })
  }


  getColor(notification){
    return notification.read ? 'text_color' : 'textColor'

  }


  clearNoti() {

    for (let item of this.notification) {
      this.api.deleteNotification(item.id).subscribe(data => {
        this.getNotify();
        this.util.presentToast('Notifications cleared');
        console.log('All notifications deleted');
      },error => {
        console.log('An error occurred while deleting notifications');
      });
    }

  }
}
