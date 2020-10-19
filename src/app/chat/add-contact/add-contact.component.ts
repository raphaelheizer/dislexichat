import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactDbService} from '../../shared/services/contact-db.service';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  @ViewChild('addct') addContactButton: ElementRef;

  // TODO: Injetar o user UID aqui. Não faz o mínimo sentido consultarmos novamente...
  userUid: string;
  requestHasErrors = false;

  constructor(
    private actModal: NgbActiveModal,
    private contactDb: ContactDbService
  ) {
  }

  ngOnInit(): void {
  }

  addContact(contactEmail: string): Promise<void | DocumentReference> {
    this.requestHasErrors = false;

    return this.contactDb.addContact(contactEmail, this.userUid)
      .then(() => {
        this.closeModal();
      })
      .catch(() => {
        this.requestHasErrors = true;
      });
  }

  closeModal(): void {
    this.actModal.dismiss('user_exit');
  }

}
