import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {Message} from '../shared/interfaces/message';
import {ChatDbService} from '../shared/services/chat-db.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AddContactComponent} from './add-contact/add-contact.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Contact} from '../shared/interfaces/contact';
import {ContactDbService} from '../shared/services/contact-db.service';
import {User} from 'firebase';
import {delay, takeUntil} from 'rxjs/operators';

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

  messages: Observable<Message[]>;

  @ViewChild('chatbody') chatBody: ElementRef;

  private currentChat = '';

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
    this.messages = this.chatDb.getMessages(this.currentChat);
    this.contacts = this.contactDb.getContactList(this.user.uid);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  async writeMessage(): Promise<void> {
    const bufferedMessage = this.msgGroup.get('msgInput').value;
    this.msgGroup.get('msgInput').setValue('');

    await this.chatDb.writeMessage(bufferedMessage, this.currentChat, this.user)
      .catch(e => {
        console.error(e);
        this.msgGroup.get('msgInput').setValue(bufferedMessage);
      });

    this.chatBody.nativeElement.scrollTo(0, this.chatBody.nativeElement.scrollHeight);
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
      this.currentChat = chatId;
      localStorage.setItem('currentChat', chatId);

      if (this.currentChat) {

        this.destroy.next();
        this.messages = this.chatDb.getMessages(this.currentChat);

        this.messages.pipe(takeUntil(this.destroy)).pipe(delay(100)).subscribe(() => {
          this.chatBody.nativeElement.scrollTo(0, this.chatBody.nativeElement.scrollHeight);
        });
      }
    });
  }

  logout(): Promise<boolean> {
    return this.auth.logout();
  }

}

