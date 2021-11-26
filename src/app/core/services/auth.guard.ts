import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private nav: NavController,
    private storage: StorageService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const result = await this.storage.getStorage('token');
    if (!result) {
      this.nav.navigateRoot('user/sign-in');
      return false;
    }
    return true;

  }
}
