import { Injectable } from '@angular/core';
import {  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class Interceptor implements HttpInterceptor {

  private token = localStorage.getItem('CapacitorStorage.token');
  constructor() {}
  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if (this.token) {
      const item = this.token.replace(/['"]+/g, '');
      console.log(item);
      request = request.clone({ setHeaders: { Authorization: 'Bearer ' + item } });
    }
    console.log(request);
    return next.handle(request);
  }

}
