import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { viewClassName } from '@angular/compiler';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private route: ActivatedRoute, private Auth: AuthService, private router: Router ) {
   
   }

  ngOnInit(): void {

     
    }
 
    
  verificaAuth(){
    if (this.router.url === '/auth/cadastro' || this.router.url === '/auth/login'){
      return true;
    }else{
      return false;
    }
  }
  logado(){
    return this.Auth.isLoggedIn();
    //console.log(this.Auth.isLoggedIn())
  }
  sair(){
    let token = this.Auth.getToken();
    $.ajax({
      type: 'POST',
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);
      },
      url: environment.api_url + '/usuario/logout',
      dataType: 'json',
      async: true,
    })
      .done((data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Logout feito!',
          showConfirmButton: false,
          timer: 1500,
          width: '300px',
        });
        //console.log(data);
        this.Auth.logout();
        //this.router.navigateByUrl('/auth/login');
        this.router.navigate(['/auth/login']);
        
        //this.router.navigate(['']);
      })
      .fail((error) => {

      });
  }
}
