
let wrapper = document.getElementById('wrapper');
let chooseBtn = document.getElementById('chooseBtn');

let div = documet.createElement('div');
div.setAttribute('id', 'IMGdiv');

chooseBtn.addEventListener('change', function () {
    let pdf = chooseBtn.files[0];
    let docType = /pdf.*/;

    if(pdf.file.match(docType)){

        let reader = new FileReader();
        reader.onload = function () {
            div.innerHTML = "";

            let file = new File;

        }

    }


});