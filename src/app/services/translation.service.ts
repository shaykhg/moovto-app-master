import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

/**
 * This service is used to load the language in the app,
 * it fetches the language file and make it available
 * depending on the chosen language
 */
export class TranslationService {

    public languages = [{name: 'English', value: 'en'}, {name: 'Spanish', value: 'es'}, {name: 'Arabic', value: 'ar'}];
    public ready = false;
    private lang = 'fi';
    private translations;
    public greeting: string;

    constructor(private storage: LocalStorageService, private http: HttpClient) {
        this.init();
    }

    /**
     * This function can be called to find any word in current language
     * @param key is the key of the word
     */
    public getString(key) {
        //  console.log('Key', key, this.translations);
        return this.translations ? this.translations[key] : '';
    }

    /**
     * This function is supposed to be called when language is changed
     * @param code is the language code e.g en (English),es(Spanish),ar(Arabic)
     */
    public changeLanguage(code: string) {
        this.ready = false;
        this.lang = code;
        console.log('Lang is change', code);
        this.storage.setItem('lang', code);
        this.loadLang();
    }

    private async init() {
        this.lang = await this.storage.getItem('lang');
        console.log('Stored lang is ', this.lang);
        this.lang = this.lang || 'fi';
        this.loadLang();
    }

    public getLang(){

        return this.lang;
    }

    /**
     * This function loads the language file and set the contents
     * to local private object, it uses lang variable to identify
     * chosen language
     */
    private loadLang() {
        this.http.get<any>(`../assets/json/${this.lang}.json`).subscribe(data => {
            console.log('Lang', data);
            this.translations = data;
            this.ready = true;
        }, error => {
            console.log('Unable to load translations', error);
            this.ready = true;
        });
    }

    getGreetings(lang) {
        const today = new Date();
        const curHr = today.getHours();
        if (lang === 'fi') {
            if (curHr < 12) {
                this.greeting = 'Hei, Hyvää huomenta';
            } else if (curHr < 18) {
                this.greeting = 'Hei, Hyvää päivää';

            } else {
                this.greeting = 'Hei, Hyvää iltaa';

            }
        } else {
            if (curHr < 12) {
                this.greeting = 'Hi, Good Morning';
            } else if (curHr < 18) {
                this.greeting = 'Hi, Good Afternoon';
            } else {
                this.greeting = 'Hi, Good Evening';

            }
        }


    }
}
