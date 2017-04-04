function addField () {
    var myTable = document.getElementById("myTable");
    var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(-1);

    var exercise = document.createElement("input");
    exercise.setAttribute("name", "exercise" + currentIndex);
    exercise.setAttribute('class', 'inputtable');

    var description = document.createElement("input");
    description.setAttribute("name", "description" + currentIndex);
    description.setAttribute('class', 'inputtable');

    var distance = document.createElement("input");
    distance.setAttribute("name", "distance" + currentIndex);
    distance.setAttribute('class', 'inputtable');

    var rest = document.createElement('input');
    rest.setAttribute('name', 'rest' + currentIndex);
    rest.setAttribute('class', 'inputtableSmall');

    var help = document.createElement('input');
    rest.setAttribute('name', 'help' + currentIndex);
    help.setAttribute('class', 'inputtable');

    var total = document.createElement('input');
    total.setAttribute('name', 'total' + currentIndex);
    total.setAttribute('class', 'inputtableSmall');

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(exercise);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(description);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(distance);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rest);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(help);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(total);
}
 function removeField() {
     document.getElementById('myTable').deleteRow(-1);
 }
module.exports = removeField();
module.exports = addField();


//
// function tableFunction() {
//
//     console.log('hej');
// let table = document.getElementById('myTable');
//
//
//     let addBox = document.createElement('input');
//     addBox.setAttribute('type', 'text');
//     addBox.setAttribute('class', 'inputtable');
//
//
//     table.appendChild(addBox);
// }
//     module.exports = tableFunction();