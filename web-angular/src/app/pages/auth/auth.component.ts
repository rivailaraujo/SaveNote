import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit {
  temcidades: boolean = false;
  temestados: boolean = false;
  cidades: any = false;
  estados: any = false;
  selectedbutton = '';

  LoginModal = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  loginForm = new FormGroup({
    email: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.email])
    ),
    senha: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(4)])
    ),
  });

  cadastroForm = new FormGroup({
    nome: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(4)])
    ),
    estado: new FormControl(null, Validators.required),
    cidade: new FormControl(null, Validators.required),
    email: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.email])
    ),
    senha: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(4)])
    ),
  });

  constructor(private route: ActivatedRoute, private Auth: AuthService, private router: Router ) {}

  ngOnInit(): void {
    this.montaUF();
    var body = document.querySelector('body');
    // this.LoginModal.fire({
    // 	icon: 'success',
    // 	title: 'Login feito com sucesso'
    //   })
    console.log(environment.api_url);

    if (this.route.snapshot.params.id == 'cadastro') {
      body.className = 'cadastrar-js';
    } else {
      body.className = 'entrar-js';
    }

    var btnEntrar = document.querySelector('#entrar');
    var btnCadastrar = document.querySelector('#cadastrar');

    btnEntrar.addEventListener('click', function () {
      body.className = 'entrar-js';
    });

    btnCadastrar.addEventListener('click', function () {
      body.className = 'cadastrar-js';
    });

    //let estados: string[] = [ "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"]
  }

  logado(){
    return this.Auth.isLoggedIn();
    //console.log(this.Auth.isLoggedIn())
  }

  clear() {
    this.cadastroForm.reset();
    this.cadastroForm.clearValidators();
    $('#estado').val('').change();
    this.cidades = false;
    $('#cidade').html('');
    //this.cadastroForm.get('estado').value('Selecione seu estado')
  }

  enviarlogin() {
    if (this.loginForm.valid) {
      if (this.Auth.login(this.loginForm.value) == true) {
        this.LoginModal.fire({
          icon: 'success',
          title: 'Login feito com sucesso',
        });
        this.router.navigate(['/']);
      }
      else {
        this.LoginModal.fire({
          icon: 'error',
          title: 'Credenciais inválidas',
        });
      }
    } else {
      Object.keys(this.loginForm.controls).forEach((field) => {
        // {1}
        const control = this.loginForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  enviarcadastro() {
    if (this.cadastroForm.valid) {
      $.ajax({
        type: 'POST',
        url: environment.api_url + '/usuario/',
        dataType: 'json',
        data: this.cadastroForm.value,
        async: true,
      })
        .done((response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tudo certo',
            text: 'Cadastrado com sucesso',
            showConfirmButton: false,
            timer: 2000,
            width: '300px',
          });
          this.cadastroForm.reset();
          let body = document.querySelector('body');
          body.className = 'entrar-js';
        })
        .fail((error) => {
          if (error.responseJSON.code == '001') {
            this.cadastroForm.get('email').reset();
            this.cadastroForm.get('email').markAsTouched({ onlySelf: true });
            console.log(error.responseJSON);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Oops...',
              text: error.responseJSON.mensagem,
              showConfirmButton: false,
              timer: 2000,
              width: '300px',
            });
          } else {
            if (error.responseJSON.code == '100') {
              this.cadastroForm.get('nome').reset();
              this.cadastroForm.get('nome').markAsTouched({ onlySelf: true });
              console.log(error.responseJSON);
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: error.responseJSON.mensagem,
                showConfirmButton: false,
                timer: 2000,
                width: '300px',
              });
            }
          }
        });
    } else {
      Object.keys(this.cadastroForm.controls).forEach((field) => {
        // {1}
        const control = this.cadastroForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  montaCidade(estado) {
    $('#cidade').html('');
    this.temcidades = false;
    $.ajax({
      type: 'GET',
      url:
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' +
        estado +
        '/municipios',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
    })
      .done((data) => {
        this.cidades = '';
        let responsecidade = '';
        $.each(data, function (c, cidade) {
          responsecidade +=
            '<option value="' + cidade.nome + '">' + cidade.nome + '</option>';
        });
        console.log($('#estado').val());
        //this.cidades = '<option value="">' + "Selecione sua cidade" + '</option>'
        this.cidades = responsecidade;
        console.log(this.temcidades);
        if (this.temestados && $('#estado').val() != '') {
          console.log('entrou');
          this.temcidades = true;
        }

        // PREENCHE AS CIDADES DE ACORDO COM O ESTADO
        $('#cidade').html(this.cidades);
      })
      .fail((error) => {
        alert('Error occured');
      });
  }

  montaUF() {
    //console.log("AKI")
    $.ajax({
      type: 'GET',
      url:
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
    })
      .done((data) => {
        //console.log(data);
        this.estados = '';
        let responseestados = '';
        $.each(data, function (e, estado) {
          responseestados +=
            '<option value="' + estado.sigla + '">' + estado.nome + '</option>';
        });
        this.estados = responseestados;

        this.temestados = true;

        // PREENCHE OS ESTADOS BRASILEIROS
        $('#estado').append(this.estados);

        // CHAMA A FUNÇÃO QUE PREENCHE AS CIDADES DE ACORDO COM O ESTADO
        //console.log($('#estado').val())
        this.montaCidade($('#estado').val());

        // VERIFICA A MUDANÇA NO VALOR DO CAMPO ESTADO E ATUALIZA AS CIDADES

        let estados_html = document.querySelector('#estado');
        estados_html.addEventListener('change', () => {
          this.montaCidade($('#estado').val());
        });
      })
      .fail((error) => {
        alert('Error occured');
      });
  }
}
