import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  setStorage = async (key: string, value: any) => {
    await Storage.set({ key, value: JSON.stringify(value)});
  };

  getStorage = async (key: string) => {
    const item: any = await Storage.get({ key });
    return JSON.parse(item.value);
  };

  removeStorage = async (key: string) => {
    await Storage.remove({ key });
  };

  clearStorages = async () => {
    await Storage.clear();
  };
}
