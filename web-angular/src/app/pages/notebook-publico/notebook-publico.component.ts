import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { data } from 'jquery';
declare const showdown: any;
declare const SimpleMDE: any;
var simplemde: any;
@Component({
  selector: 'app-notebook-publico',
  templateUrl: './notebook-publico.component.html',
  styleUrls: ['./notebook-publico.component.css']
})
export class NotebookPublicoComponent implements OnInit {
  notebook_selecionado: number;
  notebook = {
    nome_notebook: '',
    avaliacao_media: 0,
    publico: 0,
    autor: ''
  };
  anotacoes: any = null;
  anotacao: any;
  anotacao_selecionada: any = null;
  constructor(private Auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((parametros) => {
      if (parametros['id_notebook']) {
        this.notebook_selecionado = parametros['id_notebook'];
        console.log(this.notebook_selecionado);
        this.getInfoNotebook(this.notebook_selecionado);
        if (simplemde != undefined) {
          simplemde.toTextArea();
          simplemde = null;
        }
        this.anotacao_selecionada = null;
        this.anotacoes = null;
      }
    });
  }

  getInfoNotebook(notebook) {
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/documento/notebookPublico/' + notebook,
      dataType: 'json',
      async: true,
      headers: {
        Authorization: 'Bearer ' + this.Auth.getToken(),
      },
    })
      .done((data) => {
        this.notebook = data[0];
        this.getInfoAnotacao(notebook);
        console.log(this.notebook);
      })
      .fail((error) => {
        //console.log(error);
      });
  }
  getInfoAnotacao(notebook) {
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/documento/anotacoes/' + notebook,
      dataType: 'json',
      async: true,
      headers: {
        Authorization: 'Bearer ' + this.Auth.getToken(),
      },
    })
      .done((data) => {
        console.log(data);
        if (data.mensagem) {
          this.anotacoes = null;
        } else {
          data.map(function (nota) {
            nota.status = false;
          });
          console.log(notebook);
          this.anotacoes = data;
          console.log(this.anotacoes);
        }

      })
      .fail((error) => {
        //console.log(error);
      });
  }

  getNota(anotacao) {
    this.anotacao_selecionada = anotacao.id_anotacao;
    console.log(this.anotacao_selecionada);
    if (simplemde != undefined) {
      simplemde.toTextArea();
      simplemde = null;
    }

    this.anotacoes.map(function (item) {
      if (item.id_anotacao == anotacao.id_anotacao) {
        anotacao.status = !anotacao.status;
      } else {
        item.status = false;
      }
    });
    $.ajax({
      type: 'GET',
      url:
        environment.api_url +
        '/documento/notaPublica/' +
        this.notebook_selecionado +
        '/' +
        anotacao.id_anotacao,
      //dataType: 'json',
      async: true,
      headers: {
        Authorization: 'Bearer ' + this.Auth.getToken(),
      },
    })
      .done((data) => {
        console.log('teste');
        this.carregarEditor(
          data,
          this.notebook_selecionado,
          anotacao.id_anotacao
        );
        //let barraedicao =  document.getElementsByClassName("editor-toolbar")[0] as HTMLElement ;
        //barraedicao.style.display = "none";
        this.alterarEditor();
      })
      .fail((error) => {
        //console.log(error);
      });
  }
  carregarEditor(texto, id_notebook, id_anotacao) {
    let token = this.Auth.getToken();
    simplemde = new SimpleMDE({
      element: document.getElementById('teste') as HTMLElement,
      autofocus: true,
      //styleSelectedText: false,
      renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: true,
      },
      spellChecker: false,
      toolbar: [
        {
          name: 'Salvar',
          action: savefile,
          //action: SimpleMDE.togglePreview,
          className: 'fa fa-floppy-o',
          title: 'Custom Button',
        },
        '|',
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        'table',
        '|',
        'code',
        'link',
        'image',
        'preview',
        '|',
        'guide',
      ],
    });
    simplemde.value(texto);

    simplemde.codemirror.on('change', function () {
      console.log('Testando foco');
    });

    function savefile() {

      let SucessModal = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      var texto = {
        txt: simplemde.value(),
      };
      //this.alterarEditor();
      $.ajax({
        type: 'POST',
        url:
          environment.api_url +
          '/documento/nota/' +
          id_notebook +
          '/' +
          id_anotacao,
        //dataType: 'json',
        async: true,
        data: texto,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .done((data) => {
          let view: any = document.getElementsByClassName(
            'fa fa-eye no-disable'
          )[0] as HTMLElement;
          view.click();
          console.log('Entroy');
          let barraedicao: any = document.getElementsByClassName(
            'editor-toolbar'
          )[0] as HTMLElement;
          let menu: any = document.getElementsByClassName(
            'editor-toolbar-2'
          )[0] as HTMLElement;
          if (barraedicao.style.display === 'none') {
            barraedicao.style.display = 'block';
            menu.style.display = 'none';
          } else {
            barraedicao.style.display = 'none';
            menu.style.display = 'block';
          }
          SucessModal.fire({
            icon: 'success',
            title: 'Salvo!',
            });
        })
        .fail((error) => { });
    }

    var elementeclick = document.getElementsByClassName(
      'fa fa-eye no-disable'
    )[0] as HTMLElement;
    elementeclick.click();
    //document.getElementsByClassName("fa fa-eye no-disable")[0].style.display = "none";
  }

  alterarEditor() {
    let view: any = document.getElementsByClassName(
      'fa fa-eye no-disable'
    )[0] as HTMLElement;
    view.click();
    console.log('Entroy');
    let barraedicao: any = document.getElementsByClassName(
      'editor-toolbar'
    )[0] as HTMLElement;
    let menu: any = document.getElementsByClassName(
      'editor-toolbar-2'
    )[0] as HTMLElement;
    if (barraedicao.style.display === 'none') {
      barraedicao.style.display = 'block';
      menu.style.display = 'none';
    } else {
      barraedicao.style.display = 'none';
      menu.style.display = 'block';
    }
  }

}
