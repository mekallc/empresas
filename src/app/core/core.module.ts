import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { MomentModule } from 'ngx-moment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import ApiInterceptor from '@core/services/http.interceptor';
import { NotificationsComponent } from '@core/widgets/notifications/notifications.component';
import { SolicitudModalComponent } from '@core/widgets/solicitud-modal/solicitud-modal.component';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function playerFactory() { return player; }

@NgModule({
  exports: [NotificationsComponent, SolicitudModalComponent],
  declarations: [NotificationsComponent, SolicitudModalComponent],
  entryComponents: [NotificationsComponent, SolicitudModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    MomentModule,
    TranslateModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({ apiKey: environment.maps, libraries: ['places'] }),
    NgxStripeModule.forRoot('pk_test_51JwvutBciJuLJJgxehspy5c9SROduRtoSFUOFSQ2PfpRBsD1QaXju0czIxUcPwv0NEOoDChSD4mLhrB79H0RSbrH00ozf6cT3F'),
    provideStorage(() => getStorage()),
    provideFirestore(() => {
      const firestore = getFirestore();
      // connectFirestoreEmulator(firestore, 'localhost', 8080);
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    LottieModule.forRoot({ player: playerFactory }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(library: FaIconLibrary) {  library.addIconPacks(fas, fab, far); 	}
}
