import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AppConstants {
    public static BASE_URL = 'https://api.easyshifters.com';
    public static APP_API_URL = 'https://www.easyshifters.com/api';
    public static ORDER = {
        items : []
    };
    public static API = {

        LOGIN : AppConstants.BASE_URL + '/auth/local',
        CATEGORIES : AppConstants.BASE_URL + '/categories?enable=true',
        SUB_CATEGORIES : AppConstants.BASE_URL + '/subcategories?enable=true',
        REGISTER : AppConstants.BASE_URL + '/auth/local/register',
        VEHICLES : AppConstants.BASE_URL + '/vehicles',
        CHARGES : AppConstants.BASE_URL + '/charges',
        USER : AppConstants.BASE_URL + '/users',
        ORDERS : AppConstants.BASE_URL + '/orders',
        CONTACT : AppConstants.BASE_URL + '/contacts',
        GET_PEOPLE : AppConstants.BASE_URL + '/extras?identifier=people',
        SEND_EMAIL : AppConstants.APP_API_URL + '/sendEmail',
        UPLOAD_IMAGE : AppConstants.BASE_URL + '/upload',
        EXTRA_CHARGES : AppConstants.BASE_URL + '/extracharges',
        NOTIFICATION:AppConstants.BASE_URL + '/notifications',
        GET_DISTANCE:AppConstants.APP_API_URL + '/bridge',
        GET_COORDINATES : 'https://maps.googleapis.com/maps/api/geocode/json?address=',
        GET_ADDRESS: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
        COUPON:  AppConstants.BASE_URL + '/coupons'


    };
    public static API_KEY_MAP = '';
    public static IS_LOGGED_IN = false;
    public static user;
    public static token = '';
    public static userData;
    static FACEBOOK_ID = '561573537644778';
    static GOOGLE_ID = '231615036695-gklc894u9a3k5ei32e01svbrld7f9nn4.apps.googleusercontent.com';

    public static GET_MAPS_URL(latLng) {
        return AppConstants.API.GET_ADDRESS + latLng + '&key=' + AppConstants.API_KEY_MAP;
    }

}
