import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  dadosPerfil: any;

  constructor(private Auth: AuthService) { 
    
  }

  ngOnInit(): void {
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/usuario/perfil/',
      dataType: 'json',
      async: true,
      headers: {
        "Authorization": "Bearer " + this.Auth.getToken()
      }
  })
    .done((data) => {
      console.log(data);
      this.dadosPerfil = data[0];
      
    })
    .fail((error) => {
      //console.log(error);
    });  
  }

}
