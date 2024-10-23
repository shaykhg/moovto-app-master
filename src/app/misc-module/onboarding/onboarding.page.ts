import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage.service";
import {IonSlides} from "@ionic/angular";

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.page.html',
    styleUrls: ['./onboarding.page.scss'],
})

export class OnboardingPage implements OnInit {
    @ViewChild('mySlider')  slides: IonSlides;

    // options = {
    //     initialSlide: 0,
    //     speed: 400,
    //     slidesPerView: 2,
    //     pagination: false,
    //     spaceBetween: 30
    //
    // };

    slideOpts = {
        initialSlide: 0,
        slidesPerView: 1,
    };

    constructor(private router: Router, private local: LocalStorageService) {
    }


    ionViewDidEnter(){
        this.init();
    }

    async init(){
        const first = await this.local.getBoolean('first');
        if (first){
            await this.router.navigate(['/tabs/home'], {replaceUrl: true});
        } else {
            console.log('First Time in this app!');
        }
    }

    ngOnInit() {
        // this.getFirst();
    }

    /**
     * For Registration pass 1 and to skip to home pass 2
     * @param page
     */
    async nextPage(page: number) {
        console.log('I will set it true now!');
        await this.local.setBoolean('first', true);
        // this.router.navigateByUrl(page === 1 ? '/auth/signup' : '/tabs/home');
        if (page === 1) {
            this.router.navigateByUrl('/auth/signup')
        }
        else if (page === 2) {
            this.router.navigateByUrl('/auth/login')
        }
        else if(page===3) {
            this.router.navigateByUrl('/tabs/home')
        }
    }


    swipeNext(){
        this.slides.slideNext();
    }


}
