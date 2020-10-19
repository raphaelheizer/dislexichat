import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private activeModal: NgbActiveModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  googleLogin(): void {
    this.auth.loginWithGoogle()
      .then(val => {
        this.router.navigate(['chatroom'])

          .then(() => this.activeModal.dismiss())
          .catch(e => console.error(e));

      })
      .catch(e => console.error(e));
  }
}
