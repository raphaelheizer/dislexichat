import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {firebaseConfig} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ChatModule} from './chat/chat.module';

import {faPaperPlane} from '@fortawesome/free-regular-svg-icons';
import {faDoorOpen, faSearch, faSignOutAlt, faUserPlus} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppRoutingModule,
    ChatModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(lib: FaIconLibrary) {
    lib.addIcons(
      faPaperPlane,
      faSignOutAlt,
      faUserPlus,
      faSearch
    );
  }

}
