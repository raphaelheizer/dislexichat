import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {Contact} from '../interfaces/contact';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {User} from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class ContactDbService {

  constructor(
    private auth: AuthService,
    private angularFirestore: AngularFirestore
  ) {
  }

  getContact(email: string): Promise<DocumentData> {
    if (!email) {
      return;
    }

    return this.angularFirestore.collection('users').ref
      .where('em', '==', email)
      .limit(1)
      .get().then(value => value.docs.map(value1 => value1.data()));
  }

  getContactList(uid: string): Observable<Contact[]> {
    if (uid === '') {
      return;
    }
    return this.angularFirestore.collection('users').doc(uid).collection('contacts')
      .snapshotChanges()
      .pipe(
        map(value => value.map(doc => doc.payload.doc.data() as Contact)),
        map(value => value.sort())
      );
  }

  async addContact(contactEmail: string, myUid: string): Promise<DocumentReference> {
    const thisContact = await this.getContact(contactEmail);

    return this.angularFirestore.collection('users').doc(myUid).collection('contacts')
      .add(thisContact[0]).catch(e => {
        throw new Error(e);
      });
  }

  getChatId(contact: Contact, selfUser: User): Promise<string | void> {
    return this.angularFirestore.collection('users').doc(selfUser.uid).collection('contacts').ref
      .where('em', '==', contact.em)
      .limit(1)
      .get()
      .then(doc => {
        if ((doc.docs.map(value => value.data()))[0].cid) {
          return (doc.docs.map(value => value.data()))[0].cid;
        }

        const data = (doc.docs.map(value => value.id))[0]; // ID do contato do usuário
        this.angularFirestore.collection('chats').add({}).then(document => { // Adiciona um novo Chat em branco
          const mewDocumentId = document.id; // ID do novo documento de chat criado

          this.angularFirestore.collection('users').doc(selfUser.uid).collection('contacts') // Adiciona o id do chat ao usuário
            .doc(data).set({cid: document.id}, {merge: true}); // Faz um merge com o que está no documento

          const selfUserContact: Contact = {
            dn: selfUser.displayName,
            em: selfUser.email,
            fu: selfUser.photoURL,
            uid: selfUser.uid,
            cid: document.id
          };

          this.angularFirestore.collection('users').doc(contact.uid) // Adiciona o usuário como contato, já com o cid
            .collection('contacts').add(selfUserContact);

          return document.id; // Retorna o valor do chat novo
        });
        return data;
      })
      .catch(e => console.error(e));
  }
}
