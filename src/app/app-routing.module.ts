import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './chat/login/login.component';
import {ChatComponent} from './chat/chat.component';
import {AuthGuard} from './shared/resolvers/auth-guard.service';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'chatroom', component: ChatComponent, resolve: {user: AuthGuard}, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
