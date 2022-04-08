import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { environment } from 'src/environments/environment';

import { StoreConfigModule } from '@store/store.module';
import { appRoute } from './app.routes';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { CoreConfigModule } from '@core/core-config.module';
import { LanguageModule } from '@core/language/language.module';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    appRoute,
    CoreModule,
    BrowserModule,
    LanguageModule,
    TranslateModule,
    CoreConfigModule,
    HttpClientModule,
    StoreConfigModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
