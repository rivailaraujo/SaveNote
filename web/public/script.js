var url = "http://localhost:8000"; //Sua URL
//const hljs = require('highlight.js');





window.onload = function () {
    //var simplemde = new SimpleMDE();

    //simplemde.value("This text will appear in the editor");
    var converter = new showdown.Converter();
    //var pad = document.getElementById('pad');
    
    var markdownArea = document.getElementById('markdown');
    //var save = document.getElementById('savebuttom');
    var simplemde = new SimpleMDE({
        element: document.getElementById("teste"),
        autofocus: true,
        //styleSelectedText: false,
        renderingConfig: {
            singleLineBreaks: true,
            codeSyntaxHighlighting: true,
        },
        spellChecker: false,
        toolbar: [{
                name: "Salvar",
                action: savefile,
                //action: SimpleMDE.togglePreview,
                className: "fa fa-floppy-o",
                title: "Custom Button",
            },
            "|",
            "bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "table",
            "|", "code", "link", "image", "|", "preview", "side-by-side", "fullscreen",
            "|", // Separator
            "guide"
        ],
    
    });

    

    var convertTextAreaToMarkdown = function () {
        
        var markdownText = simplemde.value();
        
        html = converter.makeHtml(markdownText);
        console.log(html)
        
        markdownArea.innerHTML = html;
        var blocks = document.querySelectorAll('pre code:not(hljs)'); Array.prototype.forEach.call(blocks, hljs.highlightBlock);
        //hljs.highlightBlock(markdownArea);

    };

    simplemde.codemirror.on("change", function(){
        console.log("Testando foco")
        convertTextAreaToMarkdown();
        // let els = document.getElementsByClassName("editor-preview");
        // console.log(els);
        // els[0].className = "editor-preview editor-preview-active";
    });
    
    
    function savefile() {
        var texto = {
            txt: simplemde.value()
        }
        //console.log(texto);
    
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", `${url}/save`, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () { //Função a ser chamada quando a requisição retornar do servidor
            if (xhttp.readyState == 4 && xhttp.status == 200) { //Verifica se o retorno do servidor deu certo
                console.log(xhttp.responseText);
            }
        }
    
        xhttp.send(JSON.stringify(texto));
    
    
    
        //var teste = document.getElementById('teste');
        pad.addEventListener('change', convertTextAreaToMarkdown);
        teste.addEventListener('input', convertTextAreaToMarkdown);
        //save.addEventListener('click', savefile);
        
    
    
    };
    convertTextAreaToMarkdown();
    
}
