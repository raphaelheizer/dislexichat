import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Contact} from '../../shared/interfaces/contact';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

  contacts: Observable<Contact[]>;

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

  openChat(contact: Contact): void {
    console.log(contact.cid);
    this.activeModal.close(contact.cid);
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }
}
