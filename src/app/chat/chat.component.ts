import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {ChatDbService} from '../shared/services/chat-db.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AddContactComponent} from './add-contact/add-contact.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Contact} from '../shared/interfaces/contact';
import {ContactDbService} from '../shared/services/contact-db.service';
import {User} from 'firebase';
import {delay, takeUntil} from 'rxjs/operators';
import {ContactModalComponent} from './contact-modal/contact-modal.component';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  user: User;

  destroy = new Subject<any>();

  contacts: Observable<Contact[]>;
  msgGroup = new FormGroup({
    msgInput: new FormControl('')
  });

  messages = this.chatDb.messages;

  @ViewChild('chatbody') chatBody: ElementRef;

  private currentChat = localStorage.getItem('currentChat');

  constructor(
    public auth: AuthService,
    private chatDb: ChatDbService,
    private contactDb: ContactDbService,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.user = this.route.snapshot.data.user;
    this.contacts = this.contactDb.getContactList(this.user.uid);
    this.chatDb.pushMessages(this.currentChat);

    // Scrolls page to bottom when message changes
    this.messages.pipe(takeUntil(this.destroy), delay(5)).subscribe(() => {
      this.chatBody.nativeElement.scrollTo(0, this.chatBody.nativeElement.scrollHeight);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  async writeMessage(): Promise<void> {
    const bufferedMessage = this.msgGroup.get('msgInput').value;
    this.msgGroup.get('msgInput').setValue('');

    console.log(this.currentChat, 'esse é o chat atual...');
    await this.chatDb.writeMessage(bufferedMessage, this.currentChat, this.user)
      .catch(e => {
        console.error(e);
        this.msgGroup.get('msgInput').setValue(bufferedMessage);
      });
  }

  addContact(): void {
    const modal = this.modal.open(AddContactComponent);
    modal.componentInstance.userUid = this.user.uid;
  }

  async openChat(contact: Contact): Promise<void> {
    return this.contactDb.getChatId(contact, this.user).then(chatId => {
      if (!chatId) {
        return;
      }
      this.updateMessages(chatId);
    });
  }

  logout(): Promise<boolean> {
    return this.auth.logout();
  }

  contactsModal(): void {
    const ctModal = this.modal.open(ContactModalComponent, {size: 'xl', centered: true});
    ctModal.componentInstance.contacts = this.contacts;

    ctModal.result.then(chatId => {
      this.updateMessages(chatId);
    });
  }

  private updateMessages(chatId: string): void {
    if (!chatId) {
      return;
    }
    localStorage.setItem('currentChat', chatId);
    this.currentChat = chatId;
    this.chatDb.pushMessages(chatId);
  }
}

