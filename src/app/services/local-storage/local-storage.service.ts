import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItemInLocalStorage(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItemInLocalStorage(key: string) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  }

  removeItemInLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
