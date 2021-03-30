import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../app/services/auth-guard.service';
import { EditorComponent } from './pages/editor/editor.component';
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard]},
  { path: 'comunidade', component: HomeComponent },
  { path: 'auth/:id', component: AuthComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
