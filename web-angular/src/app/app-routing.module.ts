import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../app/services/auth-guard.service';
import { EditorComponent } from './pages/editor/editor.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import {NotebookPublicoComponent} from './pages/notebook-publico/notebook-publico.component'
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'editor/:id', component: EditorComponent, canActivate: [AuthGuard]},
  { path: 'comunidade', component: HomeComponent },
  { path: 'auth/:id', component: AuthComponent, canActivate: [AuthGuard]},
  { path: 'perfil', component: PerfilComponent },
  { path: 'editarPerfil', component: EditarPerfilComponent },
  { path: 'notebook/:id_notebook', component: NotebookPublicoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
