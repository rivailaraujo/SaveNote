import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  status: boolean = false;

  
  
  constructor(private Auth: AuthService, activatedRoute: ActivatedRoute) {
    
    jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function()   {
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
    }).on('click', '#criar-notebook-buttom', function(e) {
      // clicked on descendant div
      e.stopPropagation();
  });;
    
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

  criarNotebook(){

    Swal.fire({
      html:
      '<input placeholder = "Defina um nome para o Notebook" id="swal-input1" class="swal2-input">' +
      '<div><input type="checkbox" id="flag" name="flag"><label for="flag">&nbsp Público</label></div>',
      showCancelButton: true,
      confirmButtonText: 'Criar Notebook',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        let dados = {
          nome_notebook: (<HTMLInputElement>document.getElementById("swal-input1")).value,
          publico: 0,
        }
        let flag = (<HTMLInputElement>document.getElementById("flag")).checked;
        if (flag == true){
          dados.publico = 1;
        }else{
          dados.publico = 0;
        }
        if(dados.nome_notebook == ''){
          //return false;
          Swal.fire({
            showConfirmButton: false,
            icon: 'error',
            title: 'Ops...',
            text: 'Nome não pode ser vazio!',
            timer: 2000
          })

        }else{
          console.log(dados)
        $.ajax({
          type: 'POST',
          url: environment.api_url + '/documento/notebook',
          dataType: 'json',
          data: dados,
          async: true,
          headers: {
            "Authorization": "Bearer " + this.Auth.getToken()
          }
        })
        .done((data) => {
          Swal.fire(
            'Tudo Certo!',
            'Notebook Criado com Sucesso!',
            'success'
          )
        })
        .fail((error) => {
          Swal.fire({
            showConfirmButton: false,
            icon: 'error',
            title: 'Ops...',
            text: 'Nome já existente',
            timer: 2000
          })
        });
        }
        
  
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  
  }

}


