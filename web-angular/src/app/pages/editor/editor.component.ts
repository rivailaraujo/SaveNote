import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
declare const carregarEditor: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit {
  notebook_selecionado: any;
  notebook={
    nome_notebook: '',
    avaliacao_media: 0,
    publico: 0,
  };
  constructor(private Auth: AuthService,private route: ActivatedRoute ) { 
     //var simplemde = new SimpleMDE();

    //simplemde.value("This text will appear in the editor");
    

  }

  ngOnInit(): void {
    carregarEditor();
    let x: any =  document.getElementsByClassName("editor-toolbar")[0];
    x.style.display = "none";
    this.route.params.subscribe( parametros => {
      if (parametros['id']) {
        this.notebook_selecionado = parametros['id']
        console.log(this.notebook_selecionado)
        this.getInfoNotebook(this.notebook_selecionado);
      }
    });
  }

  getInfoNotebook(notebook){
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/documento/notebook/'+notebook,
      dataType: 'json',
      async: true,
      headers: {
        "Authorization": "Bearer " + this.Auth.getToken()
      }
  })
    .done((data) => {
      this.notebook = data[0];
      console.log(this.notebook)
    })
    .fail((error) => {
      //console.log(error);
    });
  }

  criarAnotacao(){
    
    Swal.fire({
      title: 'Criar Anotação',
      input: 'text',
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      inputPlaceholder: 'Defina um nome para a anotação',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Nome não pode ser vazio!'
        }
      },
      preConfirm: (value) => {
        
        let dados = {
          nome_anotacao: value,
          id_notebook: this.notebook_selecionado
        }
        $.ajax({
          type: 'POST',
          url: environment.api_url + '/documento/anotacao',
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
      },
    })
  }

  alterarEditor() {
    let view: any = document.getElementsByClassName("fa fa-eye no-disable")[0];
    view.click();
    console.log("Entroy")
    let barraedicao: any =  document.getElementsByClassName("editor-toolbar")[0];
    let menu: any =  document.getElementsByClassName("editor-toolbar-2")[0];
    if (barraedicao.style.display === "none") {
      barraedicao.style.display = "block";
      menu.style.display = "none";
    } else {
      barraedicao.style.display = "none";
      menu.style.display = "block";
    }
  }

}




    