import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  status: boolean = false;
  constructor(private Auth: AuthService) { 
    jQuery(function ($) {

      $(".sidebar-dropdown > a").click(function() {
    $(".sidebar-submenu").slideUp(200);
    if (
      $(this)
        .parent()
        .hasClass("active")
    ) {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
        .parent()
        .removeClass("active");
    } else {
      $(".sidebar-dropdown").removeClass("active");
      $(this)
        .next(".sidebar-submenu")
        .slideDown(200);
      $(this)
        .parent()
        .addClass("active");
    }
    });
    
    // $("#close-sidebar").click(function() {
    // $(".page-wrapper").removeClass("toggled");
    // });
    // $("#show-sidebar").click(function() {
    // $(".page-wrapper").addClass("toggled");
    // });
    
    });
    
  }
clickEvent(){
    this.status = !this.status;       
}
  ngOnInit(): void {
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
      //console.log(error);
    });
  
  }
  
  logado(){
    return this.Auth.isLoggedIn();
    //console.log(this.Auth.isLoggedIn())
  }

}


