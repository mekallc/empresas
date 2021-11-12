import { ServicesModule } from './core/services/services.module';
import { appRoute } from './app.routes';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    appRoute,
    BrowserModule,
    ServicesModule,
    IonicModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
