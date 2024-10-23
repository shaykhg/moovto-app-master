import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataShareService} from "../../services/data-share.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {UtilService} from "../../services/util.service";

@Component({
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {



    constructor( private _formBuilder: FormBuilder, public data: DataShareService, public util: UtilService) {
    }

    ngOnInit() {

    }

}
