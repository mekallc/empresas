import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const {url, version} = environment.api;
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  token: string;
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.storage.getStorage('token').then((res) => this.token = res);
  }

  getMaster(collection: string): Observable<any[]> {
    return this.http.get<any[]>(`${url}/${version}/${collection}`);
  }

  getMasterHeaders(collection: string): Observable<any[]> {
    console.log(this.token);
    const headers = {
      // eslint-disable-next-line max-len
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM4MTQwMjgyLCJqdGkiOiJiMDc0OTZhZWUzZGY0MTdkODI0MTNlNGNhM2M5YTYxMCIsInVzZXJfaWQiOjEyNH0.uJFn-cvXCgNt4zwpDl1zDJRC4t0b5A_LH3IaghN_bqE'
    };
    console.log(headers);
    return this.http.get<any[]>(`${url}/${version}/${collection}`, { headers });
  }
}
