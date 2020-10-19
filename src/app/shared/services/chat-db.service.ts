import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Message} from '../interfaces/message';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ChatDbService {

  constructor(
    public angularFirestore: AngularFirestore,
    private auth: AuthService
  ) {
  }

  private _messages: BehaviorSubject<Message>[];

  getMessages(chatcode: string): Observable<Message[]> {
    if (!chatcode) {
      return of([] as Message[]);
    }
    return this.angularFirestore.collection('chats').doc(chatcode).collection('messages')
      .snapshotChanges()
      .pipe(
        map(doc => doc.map(value => value.payload.doc.data() as Message)),
        map(value => value.sort((a, b) => a.dat - b.dat))
      );
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
