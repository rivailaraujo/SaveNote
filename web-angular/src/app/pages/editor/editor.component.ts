
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
  }

}




    