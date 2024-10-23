import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-parcel-return-pickup',
  templateUrl: './parcel-return-pickup.component.html',
  styleUrls: ['./parcel-return-pickup.component.scss'],
})
export class ParcelReturnPickupComponent implements OnInit {

  date;
  getTimeDate = this.formBuilder.group({
    pickDate: ['', [Validators.required]],
    time: ['', [Validators.required]],
    tillTime: ['', [Validators.required]],
    dropDate: ['', [Validators.required]],
    dropTime: ['', [Validators.required]],
    dropTillTime: ['', [Validators.required]],
  })

  constructor(private data: DataShareService,public translation:TranslationService, private formBuilder: FormBuilder, private api: ApiService, private util: UtilService,private placePredictionService: PlacePredictionService, private change: ChangeDetectorRef) {
  }
  ngOnInit() {}

  dateTime() {
    if (this.getTimeDate.valid) {
      const order = {
        pickDate: this.getTimeDate.value.pickDate,
        time: this.getTimeDate.value.time,
        tillTime: this.getTimeDate.value.tillTime,
        dropDate: this.getTimeDate.value.dropDate,
        dropTime: this.getTimeDate.value.dropTime,
        dropTillTime: this.getTimeDate.value.dropTillTime
      }
      this.data.setOrder(order)
      console.log('form is valid')

    } else {

      this.util.getMsg(this.translation.getLang() === 'en' ? 'All Fields Are Mandatory' : 'Kaikki kentät ovat pakollisia', 'Ok')
    }
  }

}
