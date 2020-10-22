import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Message} from '../interfaces/message';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ChatDbService {

  constructor(
    public angularFirestore: AngularFirestore,
  ) {
  }

  private _messages = new BehaviorSubject<Message[]>([]);
  get messages(): Observable<Message[]> {
    return this._messages.asObservable();
  }

  pushMessages(chatcode: string): void {
    if (!chatcode) {
      this._messages.next([] as Message[]);
      return;
    }

    this.angularFirestore.collection('chats').doc(chatcode).collection('messages')
      .snapshotChanges()
      .pipe(
        map(doc => doc.map(value => value.payload.doc.data() as Message)),
        map(value => value.sort((a, b) => a.dat - b.dat))
      ).subscribe(justFetchedMessages => {
      this._messages.next(justFetchedMessages);
    });
  }

  writeMessage(message: string, chatcode: string, user: User): Promise<void> {
    if (!chatcode || !message) {
      return;
    }
    return new Promise<void>(resolve => {

      const msg: Message = {
        msg: message,
        name: '',
        uid: '',
        dat: Date.now()
      };

      msg.name = user.displayName;
      msg.uid = user.uid;

      this.angularFirestore.collection('chats').doc(chatcode).collection('messages').add(msg).then(() => {
        resolve();
      });
    });
  }
}
