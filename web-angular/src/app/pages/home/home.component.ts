import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})


 

export class HomeComponent implements OnInit {

  LogOutModal = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor(private route: ActivatedRoute, private Auth: AuthService, private router: Router ) { 
    router.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          console.log('Back button pressed');
          window.location.reload();
        }
      })
    //window.location.reload();
  }

  ngOnInit(): void {
    //console.log(this.Auth.isLoggedIn())
    $.ajax({
        type: 'GET',
        url: environment.api_url + '/usuario/',
        dataType: 'json',
        async: true,
        headers: {
          "Authorization": "Bearer " + this.Auth.getToken()
        }
    })
      .done((data) => {
        //console.log(data);
        this.Auth.setUsuario(data[0]);
      })
      .fail((error) => {
        console.log(error);
      });
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
