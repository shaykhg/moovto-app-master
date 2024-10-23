import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataShareService} from "../../services/data-share.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {PlacePredictionService} from "../../services/place-prediction.service";
import {TranslationService} from "../../services/translation.service";

@Component({
    selector: 'app-choose-items',
    templateUrl: './choose-items.component.html',
    styleUrls: ['./choose-items.component.scss'],
})
export class ChooseItemsComponent implements OnInit {
    isLinear = false;
    body;
    date;
    searchTerm;
    public resultsPick = [];
    public resultsDrop = [];
    placeNamePickup = '';
    pickupAddress;
    dropAddress;
    placeNameDrop = '';
    // totalStepsCount: number;
    @ViewChild('pickupTerm', {static: false}) pickupTerm: HTMLInputElement;
    pickForm = this.formBuilder.group({
        building: ['', [Validators.required]],
        doorCode: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postCode: ['', [Validators.required, Validators.maxLength(6)]],
        name: ['', [Validators.required, Validators.maxLength(10)]],
        phone: ['', [Validators.required, Validators.maxLength(10)]],
    });

    dropForm = this.formBuilder.group({
        dropBuilding: ['', [Validators.required]],
        dropStreet: ['', [Validators.required]],
        dropPostCode: ['', [Validators.required, Validators.maxLength(6)]],
        dropName: ['', [Validators.required, Validators.maxLength(10)]],
        dropPhone: ['', [Validators.required, Validators.maxLength(10)]]
    });

    getTimeDate = this.formBuilder.group({
        pickDate: ['', [Validators.required]],
        time: ['', [Validators.required]],
        tillTime: ['', [Validators.required]],
        dropDate: ['', [Validators.required]],
        dropTime: ['', [Validators.required]],
        dropTillTime: ['', [Validators.required]],
    })


    constructor(public data: DataShareService,public translation:TranslationService, private formBuilder: FormBuilder, private api: ApiService, private util: UtilService,private placePredictionService: PlacePredictionService, private change: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.body = this.data.getOrder();
        // this.date = new Date().getUTCDate();
    }

    pickup() {
        if (this.pickForm.valid) {
            const order = {
                building: this.pickForm.value.building,
                doorCode: this.pickForm.value.doorCode,
                street: this.pickForm.value.street,
                city: this.pickForm.value.city,
                postCode: this.pickForm.value.postCode,
                name: this.pickForm.value.name,
                phone: this.pickForm.value.phone
            }
            this.data.setOrder(order)
            console.log('form is valid')

        } else {

            this.util.getMsg(this.translation.getLang() === 'en' ? 'All Fields Are Mandatory' : 'Kaikki kentät ovat pakollisia', 'Ok')
        }


    }

    dropOff() {
        if (this.dropForm.valid) {
            const order = {
                dropBuilding: this.dropForm.value.dropBuilding,
                dropStreet: this.dropForm.value.dropStreet,
                dropPostCode: this.dropForm.value.dropPostCode,
                dropName: this.dropForm.value.dropName,
                dropPhone: this.dropForm.value.dropPhone
            }
            this.data.setOrder(order)
            console.log('form is valid')

        } else {

            this.util.getMsg(this.translation.getLang() === 'en' ? 'All Fields Are Mandatory' : 'Kaikki kentät ovat pakollisia', 'Ok')
        }
    }


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

    handleSearch(term, type) {
        this.searchTerm = term;
        console.log('this is search term', term);
        if (this.searchTerm === '') {
            return;
        } else {
            if (type === 1) {
                this.resultsPick = [];
                this.placePredictionService.getPlacePredictions(term).subscribe(data => {
                    console.log('********************', data);
                    if (data) {
                        this.resultsPick = data;
                        this.change.detectChanges();
                    } else {
                    }

                }, error => {
                });
            } else {
                this.resultsDrop = [];
                this.placePredictionService.getPlacePredictions(term).subscribe(data => {
                    console.log('********************', data);
                    if (data) {
                        this.resultsDrop = data;
                        this.change.detectChanges();
                    } else {
                    }

                }, error => {
                });
            }

        }

    }

    async setPickUpAddress(address) {
        console.log('this is addresss***********', address);
        this.placeNamePickup = address.description;
        this.placePredictionService.getDetails(address.place_id).subscribe(data => {
            console.log(data);
            // this.pickupForm.patchValue({
            //     postcode: data.postcode,
            //     city: data.city,
            //     street: data.street,
            // });
            this.pickForm.controls.postCode.markAsDirty();
            this.pickForm.controls.postCode.setValue(data.postcode);
            this.pickForm.controls.city.setValue(data.city);
            this.pickForm.controls.street.setValue(data.street);
            this.pickForm.controls.postCode.setValue(data.postal);
            this.pickupAddress = data;
            this.util.savePickup(data);
            this.pickForm.enable();
            // this.pickupForm.markAsDirty();
            // this.pickupForm.markAsPristine();
        }, error => {
            console.log(error);
        });
    }

    async setDropAddress(address) {
        this.placeNameDrop = address.description;
        this.placePredictionService.getDetails(address.place_id).subscribe(data => {

            this.dropForm.patchValue({
                postcode: data.postal,
                city: data.city,
                street: data.street,
            });
            // this.dropForm.controls.postcode.setValue(data.postcode);
            // this.dropForm.controls.city.setValue(data.city);
            // this.dropForm.controls.street.setValue(data.street);
            // this.dropForm.controls.postcode.setValue(data.postal);
            this.dropAddress = data;
            this.util.saveDrop(data);
            this.dropForm.enable();
            // this.dropForm.markAllAsTouched();
            // this.dropForm.markAllAsTouched();
        }, error => {
            console.log(error);
        });
    }


}


//   submit(){
//     // Collect all data
//     const order = {
//
//     }
//     this.data.setOrder()
//     const order = {'email': 'Some@gmail.com'}
//     this.data.setOrder(order);
//   }
//
// }

