import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const {url, version, headers} = environment.api;
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private http: HttpClient
  ) { }

  getMaster(collection: string): Observable<any[]> {
    return this.http.get<any[]>(`${url}/${version}/${collection}`);
  }
}
