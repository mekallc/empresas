import { Injectable } from '@angular/core';
import {  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()

export class Interceptor implements HttpInterceptor {

  constructor(
    private storage: StorageService
  ) {}
  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    console.log(request);
    return next.handle(request);
  }

  private getToken = () => {
    let value: string;
    this.storage.getStorage('token').then((res) => value = res);
    return value;
  };
}
