import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisteruserComponent } from './registeruser/registeruser.component';
import { QuizComponent } from './quiz/quiz.component';
import { CodeComponent } from './code/code.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  {path: '', component: RegisteruserComponent},
  {path: 'register', component: RegisteruserComponent},
  {path: 'quiz', component: QuizComponent, canActivate: [AuthGuardService]},
  {path: 'testcode', component: CodeComponent, canActivate: [AuthGuardService],runGuardsAndResolvers: 'always'},
  {path: 'thankyou', component: ThankyouComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
