import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {User} from 'firebase';
import {first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, Resolve<User> {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.angularFireAuth.authState.pipe(first(), map(user => {
      if (!user) {
        this.router.navigate([''])
          .catch(e => {
            console.log(e.message);
          });
        return false;
      }
      return true;
    }));
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<firebase.User> | Promise<firebase.User> | firebase.User {
    return this.auth.angularFireAuth.currentUser;
  }


}
