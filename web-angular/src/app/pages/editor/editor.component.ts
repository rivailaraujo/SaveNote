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
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  
  dados;
  notebook_selecionado: number;
  notebook = {
    nome_notebook: '',
    avaliacao_media: 0,
    publico: 0,
  };
  anotacoes: any = null;
  anotacao: any;
  anotacao_selecionada: any = null;
  constructor(private Auth: AuthService, private route: ActivatedRoute) {
    //var simplemde = new SimpleMDE();
    //simplemde.value("This text will appear in the editor");
  }

  ngOnInit(): void {
    
    //this.carregarEditor('');
    //let x: any =  document.getElementsByClassName("editor-toolbar")[0] as HTMLElement ;
    //x.style.display = "none";
    this.route.params.subscribe((parametros) => {
      if (parametros['id']) {
        this.notebook_selecionado = parametros['id'];
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
      url: environment.api_url + '/documento/notebook/' + notebook,
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

  criarAnotacao() {
    Swal.fire({
      title: 'Criar Anota????o',
      input: 'text',
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      inputPlaceholder: 'Defina um nome para a anota????o',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Nome n??o pode ser vazio!';
        }
      },
      preConfirm: (value) => {
        let dados = {
          nome_anotacao: value,
          id_notebook: this.notebook_selecionado,
        };
        $.ajax({
          type: 'POST',
          url: environment.api_url + '/documento/anotacao',
          dataType: 'json',
          data: dados,
          async: true,
          headers: {
            Authorization: 'Bearer ' + this.Auth.getToken(),
          },
        })
          .done((data) => {
            Swal.fire('Tudo Certo!', 'Notebook Criado com Sucesso!', 'success');
            this.getInfoAnotacao(this.notebook_selecionado);
          })
          .fail((error) => {
            Swal.fire({
              showConfirmButton: false,
              icon: 'error',
              title: 'Ops...',
              text: 'Nome j?? existente',
              timer: 2000,
            });
          });
      },
    });
  }

  getInfoAnotacao(notebook) {
    $.ajax({
      type: 'GET',
      url: environment.api_url + '/documento/anotacoesUsuario/' + notebook,
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
        '/documento/nota/' +
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
  
  excluirAnotacao(anotacao){

    Swal.fire({
      title: 'Voc?? tem certeza?',
      text: "Voc?? perder?? sua anota????o!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
      if (result.isConfirmed) {
        let dados = {
          id_notebook: this.notebook_selecionado,
          id_anotacao: anotacao.id_anotacao
        }
        $.ajax({
          type: 'DELETE',
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
            'Altera????es feitas com Sucesso!',
            'success'
          )
          if (simplemde != undefined) {
            simplemde.toTextArea();
            simplemde = null;
          }
          this.anotacao_selecionada = null;
          this.anotacoes = null;
          this.getInfoAnotacao(this.notebook_selecionado);
          //this.getMeusNotebooks();
          //this.router.navigate(['/comunidade']);
        })
        .fail((error) => {
          Swal.fire({
            showConfirmButton: false,
            icon: 'error',
            title: 'Ops...',
            text: 'Nome j?? existente',
            timer: 2000
          })
        });
      }
    })
  }
}
