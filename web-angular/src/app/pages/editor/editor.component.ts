
import { Component, OnInit } from '@angular/core';
declare const carregarEditor: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor() { 
     //var simplemde = new SimpleMDE();

    //simplemde.value("This text will appear in the editor");
    

  }

  ngOnInit(): void {
    carregarEditor();
    let x: any =  document.getElementsByClassName("editor-toolbar")[0];
    x.style.display = "none";
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




    