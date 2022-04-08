import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private nav: NavController,
    private storage: StorageService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const result = await this.storage.getStorage('userCompany');
    if (!result) {
      this.nav.navigateRoot('/user/signIn');
      return false;
    }
    return true;

  }
}
