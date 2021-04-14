import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  dadosPerfil: any;
  imagem: any;
  temcidades: boolean = false;
  temestados: boolean = false;
  cidades: any = false;
  estados: any = false;
  selectedbutton = '';

  perfilForm = new FormGroup({
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
  });

  constructor(private Auth: AuthService) { }

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
      this.montaUF();
      this.perfilForm.controls.nome.setValue(this.dadosPerfil.nome);
      this.perfilForm.controls.email.setValue(this.dadosPerfil.email);
    })
    .fail((error) => {
      //console.log(error);
    });  
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
        //console.log($('#estado').val());
        //this.cidades = '<option value="">' + "Selecione sua cidade" + '</option>'
        this.cidades = responsecidade;
        //console.log(this.temcidades);
        if (this.temestados && $('#estado').val() != '') {
          console.log('entrou');
          this.temcidades = true;
        }

        // PREENCHE AS CIDADES DE ACORDO COM O ESTADO
        $('#cidade').html(this.cidades);
        this.perfilForm.controls.cidade.setValue(this.dadosPerfil.cidade);
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
        $('#estado').val(this.dadosPerfil.estado)
        this.montaCidade($('#estado').val());
        this.perfilForm.controls.estado.setValue(this.dadosPerfil.estado);
        

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

  async editarPerfil() {
    console.log("aki: ", this.imagem)
    if(this.perfilForm.valid) {
      let data = new FormData();
      data.append('nome', this.perfilForm.controls.nome.value)
      data.append('estado', this.perfilForm.controls.estado.value)
      data.append('cidade', this.perfilForm.controls.cidade.value)
      if(this.imagem != undefined){
        data.append('imagem', this.imagem) 
      }
      new Response(data).text().then(console.log)
      $.ajax({
        type: 'PUT',
        url: environment.api_url + '/usuario/perfil',
        data: data,
        processData: false,
        contentType: false,
        async: true,
        headers: {
          "Authorization": "Bearer " + this.Auth.getToken()
        },
        success: function (result) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tudo certo',
            text: 'Perfil editado!',
            showConfirmButton: false,
            timer: 2000,
            width: '300px',
          });
        },
        error: function() {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado',
            showConfirmButton: false,
            timer: 2000,
            width: '300px',
          });
        }
      })
    }
    window.location.reload();
  }

  async alterarImagem() {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    })
    
    if (file) {
      this.imagem = file;
      const reader = new FileReader()
      reader.onload = (e) => {
        //this.imagem = e.target.result;
        this.dadosPerfil.imagem = e.target.result;
      }
      
      reader.readAsDataURL(file)
    }
  }
}
