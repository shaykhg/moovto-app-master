import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConstants} from '../AppConstants';
import {Observable} from 'rxjs';
import {SessionService} from "./session.service";
import {App} from "@capacitor/core";
import {Vehicle} from "../models/Vehicle";
import {Coupon} from "../models/Coupon";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headers;

  constructor(private http: HttpClient, private session: SessionService) {
    // if user is logged in it will set headers automatically to headers variable
    // it also observe the changes so it will automatically handle everything
    this.session.auth.subscribe(data => {
      if (data){
        this.headers = { Authorization: `Bearer ${session.getToken()}`}
      } else {
        this.headers = {};
      }
    });
  }

  doLogin(username: string, password: string): Observable<any>{
    return this.http.post(AppConstants.API.LOGIN, {
      identifier: username, password});
  }

  getOrders(): Observable<any>{
    return this.http.get(AppConstants.API.ORDERS + '?user=' + this.session.getUser()._id, {headers: this.headers});
  }

  getOrderDetails(orderId): Observable<any>{
    return this.http.get(AppConstants.API.ORDERS + '/' + orderId, {headers: this.headers});
  }
  getUser(): Observable<any>{
    return this.http.get(AppConstants.API.USER + '/' + this.session.getUser()._id, {headers: this.headers});
  }
  updateUser(body): Observable<any>{
    return this.http.put(AppConstants.API.USER + '/' + this.session.getUser()._id, body, {headers: this.headers});
  }

  getVehicles(): Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(AppConstants.API.VEHICLES, {headers: this.headers});
  }

  setUser(body): Observable<any>{
    return  this.http.post(AppConstants.API.REGISTER, body);
  }

  getNotification():Observable<any>{
    return this.http.get(AppConstants.API.NOTIFICATION+'?user=' + this.session.getUser()._id,{headers: this.headers})
  }

  deleteNotification(id):Observable<any>{
    return this.http.delete(AppConstants.API.NOTIFICATION+'/' +  id,{headers: this.headers})
  }

  getDistance(type, url):Observable<any>{
    return this.http.post(AppConstants.API.GET_DISTANCE,{type, url}, {headers: this.headers})
  }

  getPeople():Observable<any>{
    return this.http.get(AppConstants.API.GET_PEOPLE)
  }

  getVehicleCharges(day, id):Observable<any>{
    return this.http.get(AppConstants.API.CHARGES + '?day=' + day + '&vehicle=' + id)
  }


  getExtraCharges():Observable<any>{
    return this.http.get(AppConstants.API.EXTRA_CHARGES);
  }

  getAllCoupons(coupon): Observable<Coupon[]>{
    return this.http.get<Coupon[]>(AppConstants.API.COUPON + '?name_contains=' + coupon);
  }

  getCoordinates(address): Observable<any[]>{
    return this.http.get<any>(AppConstants.API.GET_COORDINATES + address + '&key=' + AppConstants.API_KEY_MAP);
  }

  getSubCategories(): Observable<any[]>{
    return this.http.get<any>(AppConstants.API.SUB_CATEGORIES + '&type_ne=parcel');
  }
  getParcelItem(): Observable<any[]>{
    return this.http.get<any>(AppConstants.API.SUB_CATEGORIES + '&type=parcel');
  }

  createOrder(body): Observable<any>{
    return this.http.post<any>(AppConstants.API.ORDERS, body, {headers: this.headers});
  }

  sendEmail(body): Observable<any>{
    return this.http.post<any>(AppConstants.API.SEND_EMAIL, body, {headers: this.headers});
  }

  sendIssue(body): Observable<any>{
    return this.http.post<any>(AppConstants.API.CONTACT, body, {headers: this.headers});
  }

  uploadImage(body): Observable<any>{
    return this.http.post<any>(AppConstants.API.UPLOAD_IMAGE, body, {headers: this.headers});
  }


}
