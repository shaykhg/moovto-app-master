import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to save the data into localstorage,
 * this service can also encrypt and decrypt on demand
 * Underneath this service uses Ionic LocalStorage To Save Data
 */
export class LocalStorageService {

  ready = false;

  constructor() {
  }

// JSON "set" example
  async setObject(key, obj) {
    await Storage.set({
      key, value: JSON.stringify(obj)
    });
  }

// JSON "get" example
  async getObject(key) {
    const obj = await Storage.get({key});
    console.log('this is error', key, obj)
    return (obj && obj.value !== 'undefined' && obj.value !== 'null') ? JSON.parse(obj.value) : {} ;
  }

  // removeObject

  async removeObject(key) {
    const obj = await Storage.remove({key});
    console.log('this is error', key, obj)
  }

  // Set string
  async setItem(key, value) {
    await Storage.set({key, value});
  }

  // Set number
  async setNumber(key, value: number) {
    await Storage.set({key, value: value.toString()});
  }

  // Set boolean
  async setBoolean(key: string, value: boolean) {
    console.log('this is key about to set', key);
    console.log('this is key about to set', value ? 'true': 'false');
    await Storage.set({key, value: value ? 'true': 'false'});
  }

  // get string, number or boolean
  async getItem(key) {
    const { value } = await Storage.get({key});
    return value;
  }

  // get string, number or boolean
  async getBoolean(key: string) {
    const { value } = await Storage.get({key});
    console.log('this is value will be get', value, key);
    return value === 'true';
  }

  // get string, number or boolean
  async getNumber(key: string) {
    const { value } = await Storage.get({key});
    return +value;
  }

  // Remove item from storage
  async removeItem(key: string) {
    await Storage.remove({ key });
  }

  // To know all items in memory
  async keys() {
    const { keys } = await Storage.keys();
    return keys;
  }

  /*
  Clear all the data in memory
  proceed with caution
   */
  // async clear() {
  //   await Storage.clear();
  // }
}
