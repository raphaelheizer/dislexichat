import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Contact} from '../interfaces/contact';
import {Router} from '@angular/router';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly SESSION_PERSISTENCE_LOCAL = firebase.auth.Auth.Persistence.LOCAL;

  constructor(
    public angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {

    this.angularFireAuth.setPersistence(this.SESSION_PERSISTENCE_LOCAL)
      .then(() => {
      });

  }

  logout(): Promise<boolean> {
    return this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['/'])
        .catch(e => console.error(e));

      return true;
    }).catch(e => {
      console.error(e);
      return false;
    });
  }

  loginWithGoogle(): Promise<void | UserCredential> {
    return this.loginWithProvider(new firebase.auth.GoogleAuthProvider());
  }

  private async loginWithProvider(provider: firebase.auth.GoogleAuthProvider): Promise<void> {
    return this.angularFireAuth.signInWithPopup(provider).then(value => {
      this.writeUserToFirestore(value.user);
    });
  }

  private writeUserToFirestore(user: User): Promise<void> {

    const contact: Contact = {
      dn: user.displayName,
      em: user.email,
      fu: user.photoURL,
      uid: user.uid
    };

    return this.angularFirestore.collection('users').doc(user.uid).set(contact);
  }

}
