import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router,} from "@angular/router";
import {DataShareService} from "../../services/data-share.service";

@Component({
    selector: 'app-confirm-weight',
    templateUrl: './confirm-weight.component.html',
    styleUrls: ['./confirm-weight.component.scss'],
})
export class ConfirmWeightComponent implements OnInit {
    // type:number

    constructor(private router: Router, private route: ActivatedRoute, private data: DataShareService) {
    }

    ngOnInit() {


    }


    proceed() {
        this.route.queryParams.subscribe(params => {
            const para = params.type
            if (params.type === 'return') {
                this.router.navigateByUrl('/order/choose-item')
            }
            else{
              if(params.type ==='delivery'){
                  this.data.parcelDelTab = [false, true, true, true]
                this.router.navigateByUrl('/order/choose-service')
              }
            }
            console.log('queryParams', para)
        })

    }
}
