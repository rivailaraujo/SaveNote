import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
	 selectedbutton = '';


	 LoginModal = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
		  toast.addEventListener('mouseenter', Swal.stopTimer)
		  toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	  })



	cadastroForm = new FormGroup({
		nome: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)])),
		estado: new FormControl(null, Validators.required),
		cidade: new FormControl(null, Validators.required),
		email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
		senha: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)])),
	  });


  constructor(private route: ActivatedRoute,) { 
	
	  
	  
  }

  ngOnInit(): void {
	
	var body = document.querySelector("body");
	console.log()
	// this.LoginModal.fire({
	// 	icon: 'success',
	// 	title: 'Login feito com sucesso'
	//   })
	console.log(environment.api_url)
	
	if(this.route.snapshot.params.id == 'cadastro'){
		body.className = "cadastrar-js";
	}else{
		body.className = "entrar-js"; 
	}
	

	var btnEntrar = document.querySelector("#entrar");
	var btnCadastrar = document.querySelector("#cadastrar");
	
	
	
	
	btnEntrar.addEventListener("click", function () {
	
	   body.className = "entrar-js"; 

	});
	
	btnCadastrar.addEventListener("click", function () {
		
		body.className = "cadastrar-js";
		
	})

    //let estados: string[] = [ "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"]
    
  }
  
  clear(){
	this.cadastroForm.reset();
	this.cadastroForm.clearValidators();	
  }
  
  enviar(){
	  if (this.cadastroForm.valid){
		$.ajax({
			type:'POST',
			url: environment.api_url+'/usuario/',
			dataType: "json",
			data: this.cadastroForm.value,
			async: true,	
		}).done(response => {
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Tudo certo',
				text: 'Cadastrado com sucesso',	
				showConfirmButton: false,
				timer: 2000,
				width: '300px'
			  })
			this.cadastroForm.reset();
			let body = document.querySelector("body");
			body.className = "entrar-js"; 
				
		}).fail(error => {
				if (error.responseJSON.code == '001'){
				this.cadastroForm.get('email').reset();
				this.cadastroForm.get('email').markAsTouched({ onlySelf: true });
				console.log(error.responseJSON)
				Swal.fire({
					position: 'center',
					icon: 'error',
					title: 'Oops...',
  					text: error.responseJSON.mensagem,	
					showConfirmButton: false,
					timer: 2000,
					width: '300px'
				  })
				}else{
					if (error.responseJSON.code == '100'){
						this.cadastroForm.get('nome').reset();
						this.cadastroForm.get('nome').markAsTouched({ onlySelf: true });
						console.log(error.responseJSON)
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: 'Oops...',
							  text: error.responseJSON.mensagem,	
							showConfirmButton: false,
							timer: 2000,
							width: '300px'
						  })
						}
				}
				
				

		})

		
		
	  }else{
		Object.keys(this.cadastroForm.controls).forEach(field => { // {1}
			const control = this.cadastroForm.get(field);            // {2}
			control.markAsTouched({ onlySelf: true });       // {3}
		});
	  }
	
	}
	

}



var cidades, estados :any;
function montaCidade(estado){
	$.ajax({
		type:'GET',
		
		url:'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+estado+'/municipios',
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
		success: function(data) {
            cidades='';

		$.each(data, function(c, cidade){

			cidades+='<option value="'+cidade.nome+'">'+cidade.nome+'</option>';

		});

		// PREENCHE AS CIDADES DE ACORDO COM O ESTADO
		$('#cidade').html(cidades);
        },
        error: function() {
            alert('Error occured');
        }
	})

	
	
}

function montaUF(){
	//console.log("AKI")
	$.ajax({
		type:'GET',
		url:'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
		success: function(data) {
            //console.log(data);
			estados='';
		$.each(data, function(e, estado){
			estados+='<option value="'+estado.sigla+'">'+estado.nome+'</option>';

		});
		//console.log(estados)
		// PREENCHE OS ESTADOS BRASILEIROS
		$('#estado').append(estados);

		// CHAMA A FUNÇÃO QUE PREENCHE AS CIDADES DE ACORDO COM O ESTADO
		//console.log($('#estado').val())
		montaCidade($('#estado').val());

		// VERIFICA A MUDANÇA NO VALOR DO CAMPO ESTADO E ATUALIZA AS CIDADES
		$('#estado').change(function(){
			//console.log(estados)
			montaCidade($(this).val());
		});
        },
        error: function() {
            alert('Error occured');
        }
	})
}


montaUF();
