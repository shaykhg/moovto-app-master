import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {UtilService} from "../../services/util.service";
import {Vehicle} from "../../models/Vehicle";
import {DataShareService} from "../../services/data-share.service";
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import {AlertController, ToastController} from "@ionic/angular";
import {MatSelectChange} from "@angular/material/select";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslationService} from "../../services/translation.service";

@Component({
    selector: 'app-time-schedule',
    templateUrl: './time-schedule.component.html',
    styleUrls: ['./time-schedule.component.scss'],
})
export class TimeScheduleComponent implements OnInit, AfterViewInit {

    // vehicles: Vehicle[] = [];
    vehicles: any = [];
    clockTheme = {
        container: {
            bodyBackgroundColor: '#fafafa',
            buttonColor: '#f89142'
        },
        dial: {
            dialActiveColor: '#fff',
            dialBackgroundColor: '#f89142'
        },
        clockFace: {
            clockFaceBackgroundColor: '#f0f0f0',
            clockHandColor: '#f89142',
            clockFaceTimeInactiveColor: '#424242'
        }
    };

    peoples = [];
    peopleModel;
    vehicle;
    maxDistance = {
        error: false,
        distance: 0
    };
    disableVehicle = false;
    disablePeople = false;
    flow = 1;
    currentDate = moment().add(1, "day").startOf("day").toDate();

    timeForm = this.formBuilder.group({
        vehicle: ['', Validators.required],
        date: ['', Validators.required,],
        from: ['', Validators.required,],
        till: ['', Validators.required],
        people: ['', Validators.required]
    });
    fromTime: AbstractControl;
    private temp: Vehicle[];
    private progress: boolean;

    constructor(private route: Router,public translation:TranslationService,public alertController: AlertController, private toast: ToastController, public data: DataShareService, private util: UtilService, private api: ApiService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.getVehicles();
        this.getPeople();

        if (this.route.url === '/order/choose-service') {
            this.flow = 2;
            this.data.flow = 2;
            this.disableVehicle = false
            this.disablePeople = true;
            console.log('I am in parcel delivery');
        } else {
            this.flow = 1;
            this.data.flow = 1;
            setTimeout(() => {
                this.disableVehicle = false;
                this.disablePeople = false;
                if (this.data.getOrder()) {
                    if (this.data.getOrder().schedule) {
                        this.timeForm.patchValue(this.data.getOrder().schedule);
                    }
                }
            }, 150);
        }

    }

    async getVehicles() {
        try {
            this.vehicles = await this.api.getVehicles().toPromise();
            for (let vehicle of this.vehicles) {
                if (vehicle.name == 'By Foot' && this.flow === 2) {
                    this.timeForm.get('vehicle').setValue(vehicle);
                    this.vehicle = vehicle;
                    this.data.vehicle = vehicle;
                }
            }
        } catch (e) {
            await this.util.presentToast(this.translation.getLang() === 'en' ? 'An error occurred, while getting vehicle information!' : 'Tapahtui virhe ajoneuvotietojen saamisessa!')
        }
    }

    saveTime() {
        if (this.timeForm.valid) {
            // continue
            this.data.setTimeInfo(this.timeForm.value);
            console.log('This is order in time schedule after saving time ' + this.data.getOrder() + 'this is Flow => ' + this.data.flow);
            this.data.flow === 1 ? this.data.tabs = [false, false, false, false] : this.data.parcelDelTab = [false, false, false, false, false];
            this.data.flow === 1 ? this.data.tabIndex = 3 : this.data.parcelDelTabIndex = 4;
        } else {
            this.util.presentToast(this.translation.getLang() === 'en' ? 'Please correct the errors first!' : 'Korjaa virheet ensin!');
        }
    }

    changePeople(charge) {
        if (this.data.timeReady) {
            console.log(charge);
            this.data.peopleCharge = parseInt(charge.value);
            this.data.people = parseInt(charge.name).toString();
            this.data.peopleData = charge;
            this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];
        } else {
            console.log('Not ready for me :-(');
        }
    }

    async changeVehicle($event: MatSelectChange) {
        const distance = this.data.getOrder().distance
        console.log('this is user input', $event.value, this.flow === 1 ? this.data.order.distance : this.data.parcelDelOrder.distance);
        console.log('Floww', this.flow, distance);
        // console.log('this is order type', this.flow === 1 ?  this.data.order : this.data.parcelDelOrder);
        if (distance <= $event.value.max_distance) {
            this.vehicle = $event.value;
            this.data.vehicle = $event.value;
            console.log('Vehicle came here', this.vehicle);
            this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];

        } else {
            console.log('Max distance reached', $event.value);
            // console.log('this is max distance', this.orderType);
            this.maxDistance.error = true;
            this.maxDistance.distance = $event.value.max_distance
            this.vehicle = undefined;
            this.timeForm.controls.vehicle.setValue(undefined);

            this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];
            await this.presentAlert(this.translation.getLang() === 'en' ? 'You cannot select this vehicle. Max distance for this vehicle is ' + $event.value.max_distance + 'km, Please use another vehicle' :
                'Et voi valita tätä ajoneuvoa. Tämän ajoneuvon enimmäisetäisyys on ' + $event.value.max_distance + 'km, käytä toista ajoneuvoa.');
            this.temp = this.vehicles;
            this.vehicles = [];
            setTimeout(() => {
                this.vehicles = this.temp;
            }, 300);
        }

    }


    /**
     * New function, this one ignores all the date & time check because now we disabled
     * picking older and current date, so= now it is safe to remove it
     * Also comparison of from and till is removed because till is being filled automatically.
     */
    async goNext() {
        const date = this.timeForm.value.date;
        const from = moment(this.timeForm.value.from).format('HH:mm');
        const till = moment(this.timeForm.value.till).format('HH:mm');
        console.log('this is vehicle and people *********', date, from, till);
        const distance = this.flow === 1 ? this.data.order.distance : this.data.parcelDelOrder.distance
        if (this.vehicle !== undefined && this.data.people !== undefined) {
            if (date === '' || from === '' || till === '') {
                this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];
                this.util.presentToast(this.translation.getLang() === 'en' ? 'Please choose data and time!' : 'Valitse tiedot ja aika!');
            } else if (distance > this.vehicle.max_distance) {
                this.timeForm.controls.vehicle.setValue(undefined);
                this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];
                await this.presentAlert(this.translation.getLang() === 'en' ? 'You cannot select this vehicle. Max distance for this vehicle is ' + this.vehicle.max_distance + 'km, Please use another vehicle' :
                    'Et voi valita tätä ajoneuvoa. Tämän ajoneuvon enimmäisetäisyys on ' + this.vehicle.max_distance +   'km, käytä toista ajoneuvoa.');
            } else {
                const d = moment(date).startOf('day');
                const from24 = moment(from, ['HH:mm']).format('HH:mm');
                const till24 = moment(till, ['HH:mm']).format('HH:mm');
                console.log(d.format('MM-DD-YYYY'), from, from24, till24, this.vehicle, this.data.people);
                this.data.saveDelivery(d.format('MM-DD-YYYY'), from24, till24, this.vehicle, this.data.people);
                this.calculateCharges(moment(from, ['HH:mm']), d.format('dddd'));
                this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];
            }
        } else {
            if (this.maxDistance.error) {
                this.timeForm.controls.vehicle.setValue(undefined);
                this.data.flow === 1 ? this.data.tabs = [false, false, false, true] : this.data.parcelDelTab = [false, false, false, false, true];

                await this.presentAlert(this.translation.getLang() === 'en' ? 'You cannot select this vehicle. Max distance for this vehicle is ' + this.vehicle.max_distance + 'Km, Please use another vehicle' :
                    'Et voi valita tätä ajoneuvoa. Tämän ajoneuvon enimmäisetäisyys on '
                    + this.vehicle.value.max_distance + this.translation.getLang() === 'en' ? ' KM, Please use another vehicle.' : 'KM, käytä toista ajoneuvoa.');
            } else {
                this.util.presentToast(this.translation.getLang() === 'en' ? 'Please choose vehicle and number of people!' : 'Valitse ajoneuvo ja ihmisten lukumäärä!');
            }
        }

    }


    async presentAlert(msg, backdropDismiss = false) {
        const alert = await this.alertController.create({
            header: 'Alert',
            message: msg,
            backdropDismiss: backdropDismiss,
            buttons: ['OK']
        });
        await alert.present();
    }

    calculateCharges(cur: moment.Moment, day) {
        /*
        Steps for calculation :
        1. Get current price from charges
        2. Find out the slot
        3. Find out distance of A TO B
        4. Add all items price and add to KM*charge
        5. Get all extra charges and calculate total
        5. Save result to charges and modify total and subtotal
         */
        this.progress = true;
        console.log('Got day', day);

        this.api.getVehicleCharges(day, this.vehicle.id).subscribe(
            (res) => {
                console.log('these are vehicle charges', res);
                this.progress = false;
                const result = JSON.parse(JSON.stringify(res));
                console.log(res);
                let found = false;
                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < result.length; j++) {
                    const item = result[j];
                    const from = moment(item.from, 'hh:mm');
                    const till = moment(item.till, 'hh:mm');
                    console.log('Time check', cur.hour(), from.hour(), till.hour());
                    if (cur.isBetween(from, till)) {
                        const charge = item.charge;
                        // Calculate total
                        let itemTotal = 0;
                        console.log('Inbetween timings', charge, this.data.getOrder().distance);
                        this.data.setVehicleCharges(charge * this.data.getOrder().distance);
                        this.data.vehicleCharge = charge * this.data.getOrder().distance;

                        console.log('Charges more ? ', this.data.getOrder().vehicleCharge, this.vehicle.max_charges);

                        if (this.data.getOrder().vehicleCharge > this.data.getOrder().vehicle.max_charges) {
                            console.log('Charges were more so decreased it', this.flow === 1 ? this.data.order.vehicleCharge : this.data.parcelDelOrder.vehicleCharge, this.vehicle.max_charges);
                            this.data.setVehicleCharges(this.vehicle.max_charges);
                            this.data.vehicleCharge = this.vehicle.max_charges;
                        } else if (this.data.getOrder().vehicleCharge < this.data.getOrder().vehicle.min_charges) {
                            console.log('charges were less so set min charge', this.vehicle.min_charges);
                            this.data.setVehicleCharges(this.vehicle.min_charges);
                            this.data.vehicleCharge = this.vehicle.min_charges;
                        }

                        console.log(this.data.getItems());
                        for (const item of this.data.getItems()) {
                            console.log(item);
                            itemTotal = itemTotal + (this.data.flow === 1 ? item.charge : item.charges);
                        }
                        console.log('this is Item total++++++++++++', itemTotal);
                        console.log('this is order before saving charges ', this.data.getOrder());
                        this.data.saveCharges(itemTotal + this.data.getOrder().vehicleCharge);
                        console.log('these are item charges', this.data.getOrder().vehicleCharge, this.vehicle.max_charges);
                        this.saveTime();

                        found = true;
                    }
                }

                if (!found) {
                    this.presentAlert(this.translation.getLang() === 'en' ? 'This time slot is not available, please choose a time between 07:00 To 21:00' : 'Tämä aikaväli ei ole käytettävissä. Valitse aika välillä 07:00 - 21:00');
                } else {
                    if (this.data.peopleCharge >= 0) {
                        console.log('About to put people charge', this.data.getOrder().subtotal, this.data.peopleCharge);
                        this.data.savePeopleCharge(this.data.people, this.data.peopleCharge);
                    }
                    setTimeout(() => {
                        // this.stepper.next();
                    }, 100);
                }

            },
            (error) => {
                this.progress = false;
                console.error(error);
            }
        );
    }

    private getPeople() {
        this.api.getPeople().subscribe(
            data => {
                this.peoples = JSON.parse(JSON.stringify(data));
                for (let people of this.peoples) {
                    if (people.name == '1 Person' && this.data.flow === 2) {
                        this.timeForm.get('people').setValue(people);
                        this.data.peopleCharge = parseInt(people.value);
                        this.data.people = parseInt(people.name).toString();
                        this.data.peopleData = people;
                    }


                }
                // this.peopleModel = _.find(this.peoples, item => item.name.includes('1 Person'));
                // this.changePeople(this.peopleModel);
                console.log('this is peoples', this.peoples);
                this.peoples = _.orderBy(this.peoples, ['value'], ['asc'])

                console.log('this is sorted peoples', this.peoples);

                console.log('Found something or not', this.peopleModel);
            },
            error => {
                console.log(JSON.stringify(error));
            }
        )
    }

    timeChange(value: any) {
        console.log('Time change', value);
        let time = moment(value, 'h:mm A');
        time = time.add(4, 'hours');
        this.data.order.till = moment(time).format('h:mm A');
    }

    ngAfterViewInit(): void {
        this.fromTime = this.timeForm.get('from');
        console.log('this is from time', this.fromTime);
        this.timeForm.get('till').setValue(moment(this.timeForm.get('from').value, 'HH:mm').add(4, 'hours').format('HH:mm'));
        this.fromTime.valueChanges.subscribe((change) => {
            console.log('Time Changed :: ', change);
            console.log('Time Changed :: ', moment(change).add(3, 'hours').toISOString());
            this.timeForm.get('till').setValue(moment(change).add(3, 'hours').toISOString());
        });
    }
}
