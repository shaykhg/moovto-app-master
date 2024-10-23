import { Component, OnInit } from '@angular/core';
import {DataShareService} from "../../services/data-share.service";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.scss'],
})
export class SchedulePickupComponent implements OnInit {
  shipmentCard = {
    shipment: false
  }
  subCategories = []

  constructor(private api: ApiService, private  data:DataShareService) { }

  ngOnInit() {
    console.log('*********************************************************')
    this.data.getOrder().subscribe(data=>{
      console.log('Data:', data)
    })
  }




}
