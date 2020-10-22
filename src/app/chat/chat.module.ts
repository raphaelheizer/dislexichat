import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ChatComponent} from './chat.component';
import {ModalComponent} from './login/modal/modal.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [LoginComponent, ChatComponent, ModalComponent, AddContactComponent, ContactModalComponent],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
    ]
})
export class ChatModule {
}
