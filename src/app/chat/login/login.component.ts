import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './modal/modal.component';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authState: Subscription;

  constructor(
    private modal: NgbModal,
    private auth: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.authState = this.auth.angularFireAuth.authState.subscribe(value => {
      if (value) {
        this.router.navigate(['chatroom'])
          .catch(e => {
            console.log(e.message);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.authState.unsubscribe();
  }

  openLoginModal(): void {
    this.modal.open(ModalComponent);
  }

}
