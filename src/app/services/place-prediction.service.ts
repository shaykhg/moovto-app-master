import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import * as _ from 'lodash';
import {MapsAPILoader} from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class PlacePredictionService {

  // Wrapper for Google Places Autocomplete Prediction API, returns
  observable;
  private autocompleteService;
  private geocoder;
  private placeService;
  options = {
    componentRestrictions: {country: 'FI'}
  };lodash

  constructor(private mapsAPILoader: MapsAPILoader, private http: HttpClient) {

    this.mapsAPILoader.load().then(() => {
      this.autocompleteService = new
      google.maps.places.AutocompleteService();
      // tslint:disable-next-line:new-parens
      this.geocoder = new google.maps.Geocoder;
    });

  }

  getPlacePredictions(term: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const request = {
        input: term,
        componentRestrictions: {country: 'fi'},
      };
      this.autocompleteService.getPlacePredictions(request, data => {
        let previousData: Array<any[]>;

        // Data validation

        if (data) {
          previousData = data;
          observer.next(data);
          observer.complete();
        }

        // If no data, emit previous data

        if (!data) {
          console.log('PreviousData: ');
          observer.next(previousData);
          observer.complete();

          // Error Handling

        } else {
          observer.error(status);
        }

      });
    });

  }

  getDetails(place) {
    return new Observable((observer: Observer<any>) => {
      this.geocoder.geocode({placeId: place}, results => {
        console.log(results);
        const address = this.getAddress(place, results[0].address_components, results[0].geometry.location, results[0].formatted_address);
        observer.next(address);
        observer.complete();
      });
    });

  }

  getAddress(place, geometry, location, full) {
    const address = {
      full_address: full,
      area: '',
      city: '',
      street_number: '',
      street_name: '',
      street: '',
      locality: '',
      postal: 0,
      country: '',
      lat: 0,
      lng: 0,
      placeId: place
    };

    for (const item of geometry) {
      if (item.types.includes('postal_code')) {
        address.postal = item.long_name;
      } else if (item.types.includes('country')) {
        address.country = item.long_name;
      } else if (item.types.includes('street_number')) {
        address.street_number = item.long_name;
      } else if (item.types.includes('route')) {
        address.street_name = item.long_name;
      } else if (item.types.includes('locality') || _.includes(item.types, 'administrative_area')) {
        address.city = item.long_name;
      }
    }

    address.lat = location.lat();
    address.lng = location.lng();
    address.street = address.street_name + address.street_number;
    return address;
  }
}
