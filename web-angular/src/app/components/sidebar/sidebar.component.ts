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
  meusnotebooks: any;

  
  
  constructor(private Auth: AuthService, activatedRoute: ActivatedRoute) {
    this.getMeusNotebooks();
    
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

  getMeusNotebooks() {
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/usuario/notebooks',
      dataType: 'json',
      async: true,
      headers: {
        "Authorization": "Bearer " + this.Auth.getToken()
      }
  })
    .done((data) => {
      this.meusnotebooks = data;
      console.log(this.meusnotebooks);
      
    })
    .fail((error) => {
      //console.log(error);
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
          this.getMeusNotebooks();
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

  editar(notebook){
    let stringhtml;
    if (notebook.publico == 1){
      stringhtml = '<input id="swal-input1" class="swal2-input" value = "'+notebook.nome_notebook+'">' +
      '<div><input type="checkbox" id="flag" name="flag" checked><label for="flag">&nbsp Público</label></div>'
    }else{
      stringhtml = '<input id="swal-input1" class="swal2-input" value = "'+notebook.nome_notebook+'">' +
      '<div><input type="checkbox" id="flag" name="flag"><label for="flag">&nbsp Público</label></div>'
    }
    Swal.fire({
      title: 'Editar Notebook',
      html: stringhtml,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        let dados = {
          id_notebook: notebook.id_notebook,
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
          type: 'PUT',
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
            'Alterações feitas com Sucesso!',
            'success'
          )
          this.getMeusNotebooks();
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


