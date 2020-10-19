import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ChatComponent} from './chat.component';
import {ModalComponent} from './login/modal/modal.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AddContactComponent } from './add-contact/add-contact.component';


@NgModule({
  declarations: [LoginComponent, ChatComponent, ModalComponent, AddContactComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ChatModule {
}
